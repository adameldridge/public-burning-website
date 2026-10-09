import "./Admin.css";
import { useEffect, useState, type FormEvent } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase/config";
import { useAuth } from "./hooks/useAuth";
import { addGig, deleteGig, getGigs, updateGig, type Gig, type GigInput } from "./gigs";

function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10);
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch {
            setError("Login failed.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="admin-login" onSubmit={handleSubmit}>
            <h2>Admin login</h2>
            <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Log in"}
            </button>
        </form>
    );
}

function GigForm({
    initial,
    onSubmit,
    onCancel,
}: {
    initial?: Gig;
    onSubmit: (gig: GigInput) => Promise<void>;
    onCancel?: () => void;
}) {
    const [venue, setVenue] = useState(initial?.venue ?? "");
    const [city, setCity] = useState(initial?.city ?? "");
    const [date, setDate] = useState(toDateInputValue(initial?.date ?? new Date()));
    const [bands, setBands] = useState(initial?.bands.join(", ") ?? "");
    const [ticketUrl, setTicketUrl] = useState(initial?.ticketUrl ?? "");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit({
                venue,
                city,
                date: new Date(date),
                bands: bands.split(",").map((band) => band.trim()).filter(Boolean),
                ticketUrl: ticketUrl.trim(),
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="gig-form" onSubmit={handleSubmit}>
            <input placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
            <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <input
                placeholder="Bands (comma separated)"
                value={bands}
                onChange={(e) => setBands(e.target.value)}
            />
            <input
                type="url"
                placeholder="Ticket link (optional)"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
            />
            <div className="gig-form-actions">
                <button type="submit" disabled={submitting}>
                    {initial ? "Save" : "Add gig"}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

function GigEditor() {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function refresh() {
        try {
            const loaded = await getGigs();
            setGigs(loaded.sort((a, b) => b.date.getTime() - a.date.getTime()));
        } catch (err) {
            console.error(err);
            setError("Couldn't load gigs.");
        }
    }

    useEffect(() => {
        async function load() {
            try {
                const loaded = await getGigs();
                setGigs(loaded.sort((a, b) => b.date.getTime() - a.date.getTime()));
            } catch (err) {
                console.error(err);
                setError("Couldn't load gigs.");
            }
        }

        load();
    }, []);

    async function handleAdd(gig: GigInput) {
        await addGig(gig);
        await refresh();
    }

    async function handleUpdate(id: string, gig: GigInput) {
        await updateGig(id, gig);
        setEditingId(null);
        await refresh();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this gig?")) return;
        await deleteGig(id);
        await refresh();
    }

    return (
        <div className="gig-editor">
            <h3>Add gig</h3>
            <GigForm onSubmit={handleAdd} />

            <h3>Existing gigs</h3>
            {error && <p className="admin-error">{error}</p>}
            <ul className="gig-editor-list">
                {gigs.map((gig) => (
                    <li key={gig.id}>
                        {editingId === gig.id ? (
                            <GigForm
                                initial={gig}
                                onSubmit={(updated) => handleUpdate(gig.id, updated)}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div className="gig-row">
                                <span>
                                    {gig.date.toLocaleDateString()} — {gig.venue}, {gig.city}
                                    {gig.bands.length > 0 && ` (w/ ${gig.bands.join(", ")})`}
                                    {gig.ticketUrl && " [tickets]"}
                                </span>
                                <span className="gig-row-actions">
                                    <button onClick={() => setEditingId(gig.id)}>Edit</button>
                                    <button onClick={() => handleDelete(gig.id)}>Delete</button>
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Admin() {
    const { user, loading } = useAuth();

    return (
        <div className="container admin-container">
            <div className="admin-header">
                <a href="#">← Back to site</a>
                {user && (
                    <button type="button" onClick={() => signOut(auth)}>
                        Log out
                    </button>
                )}
            </div>
            {loading ? <p>Loading...</p> : user ? <GigEditor /> : <LoginForm />}
        </div>
    );
}

export default Admin;

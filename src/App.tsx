import "./App.css";
import { Fragment, useEffect, useMemo, useState } from "react";
import { db } from "./firebase/config";
import { collection, getDocs } from "firebase/firestore";
import logo from "./imgs/flaming-logo.gif";

type Gig = {
    id: string;
    venue: string;
    city: string;
    date: Date;
    bands: string[];
};

function App() {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadGigs() {
            try {
                const gigsSnapshot = await getDocs(collection(db, "gigs"));
                const loadedGigs = gigsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date.toDate(),
                })) as Gig[];
                setGigs(loadedGigs);
            } catch (err) {
                console.error(err);
                setError("Couldn't load gigs right now.");
            }
        }

        loadGigs();
    }, []);

    const gigsByYear = useMemo(() => {
        const map = new Map<number, Gig[]>();
        for (const gig of [...gigs].sort((a, b) => b.date.getTime() - a.date.getTime())) {
            const year = gig.date.getFullYear();
            if (!map.has(year)) map.set(year, []);
            map.get(year)!.push(gig);
        }
        return map;
    }, [gigs]);

    return (
        <div className="container">
            <div className="header">
                <img src={logo} alt="Public Burning logo" />
            </div>

            <div className="music">
                <h2>Music</h2>
                <iframe
                    style={{ border: "0", width: "100%", height: "274px" }}
                    src="https://bandcamp.com/EmbeddedPlayer/album=2462398209/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/"
                    seamless
                >
                    <a href="https://public-burning.bandcamp.com/album/pricks-of-conscience-demo">
                        Pricks of Conscience [Demo] by Public Burning
                    </a>
                </iframe>
            </div>
            <div className="contact">
                <h2>Contact</h2>
                <p>
                    <a href="mailto:publicburning@proton.me">
                        publicburning@proton.me
                    </a>
                </p>
                <p>
                    <a href="https://www.instagram.com/public_burning"
                            target="_blank"
                            rel="noopener noreferrer"
                    >
                        instagram
                    </a>
                </p>
            </div>
            <div className="gigs">
                <h2>Gigs</h2>
                {error && <p>{error}</p>}
                {[...gigsByYear.entries()].map(([year, yearGigs]) => (
                    <Fragment key={year}>
                        <h3>{year}</h3>
                        <ul>
                            {yearGigs.map((gig) => (
                                <li key={gig.id}>
                                    {gig.date.toLocaleDateString()} - {gig.venue}, {gig.city} - w/ {gig.bands.join(', ')}
                                </li>
                            ))}
                        </ul>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default App;
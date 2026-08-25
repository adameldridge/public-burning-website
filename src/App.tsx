import "./App.css";
import { useEffect, useState } from "react";
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


    async function loadGigs(){
        const gigsSnapshot = await getDocs(collection(db, "gigs"));

        setGigs(gigsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate(),
        })) as Gig[])
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadGigs();
    }, []);

    useEffect(() => console.log(gigs), [gigs])


    return (
        <>
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
                        <a
                            href="https://www.instagram.com/public_burning"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            instagram
                        </a>
                    </p>
                </div>
                <div className="gigs">
                    <h2>Gigs</h2>
                    <h3>Upcoming</h3>
                    <ul>
                        <li>
                            12 November 2026 - Golden Lion, Bristol - w/
                            Dollhouse & Nisemono
                        </li>
                    </ul>
                    <h3>Past</h3>
                    <ul>
                        <li>
                            2 August 2026 - Exchange, Bristol - w/ The Mayor is
                            Stoned
                        </li>
                        <li>
                            18 April 2026 - Rough Trade, Bristol - Record Store
                            Day
                        </li>
                        <li>
                            6 Mar 2026 - Golden Lion, Bristol w/ Than & Downard
                        </li>
                        <li>
                            22 Jan 2026 - Exchange, Bristol w/ The Cement Garden
                            & Tungsten
                        </li>
                        <li>
                            21 Nov 2025 - Attic Bar, Bristol w/ Avalanche Kaito
                            & Cul Zag
                        </li>
                        <li>
                            26 Sep 2025 - The Croft, Bristol w/ Eat Your Own
                            Head & Downard
                        </li>
                        <li>
                            7 Sep 2025 - The Dev, London w/ TV Wife &
                            Yarraman{" "}
                        </li>
                        <li>
                            6 Sep 2025 - Kola, Portsmouth w/ TV Wife &
                            Maxwelltheband
                        </li>
                        <li>
                            5 Sep 2025 - The Four Horseman, Bournemouth w/ TV
                            Wife & Treecreeper & Mighty Magic Animal
                        </li>
                        <li>
                            4 Sep 2025 - Exchange, Bristol w/ Tension & TV Wife
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default App;

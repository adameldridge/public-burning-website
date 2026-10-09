import { db } from "./firebase/config";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

export type Gig = {
    id: string;
    venue: string;
    city: string;
    date: Date;
    bands: string[];
    ticketUrl?: string;
};

export type GigInput = {
    venue: string;
    city: string;
    date: Date;
    bands: string[];
    ticketUrl: string;
};

const gigsCollection = collection(db, "gigs");

export async function getGigs(): Promise<Gig[]> {
    const snapshot = await getDocs(gigsCollection);
    return snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
        date: docSnapshot.data().date.toDate(),
    })) as Gig[];
}

export async function addGig(gig: GigInput): Promise<void> {
    await addDoc(gigsCollection, {
        ...gig,
        date: Timestamp.fromDate(gig.date),
    });
}

export async function updateGig(id: string, gig: GigInput): Promise<void> {
    await updateDoc(doc(db, "gigs", id), {
        ...gig,
        date: Timestamp.fromDate(gig.date),
    });
}

export async function deleteGig(id: string): Promise<void> {
    await deleteDoc(doc(db, "gigs", id));
}

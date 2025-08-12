import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

const blockedSlotsCollection = collection(db, 'blockedSlots');
const DEMO_USER_ID = "demo-user-123";

export const getBlockedSlotsForDate = async (dateString) => {
    try {
        const q = query(
            collection(db, "blockedSlots"),
            where("date", "==", dateString)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching blocked slots:", error);
        return [];
    }
};

export const blockTimeSlot = async (date, time, timeZone, reason = '') => {
    try {
        // Generate consistent ID for demo slots
        const slotId = `demo-${date}-${time.replace(':', '')}`;

        await setDoc(doc(blockedSlotsCollection, slotId), {
            userId: DEMO_USER_ID,
            date,
            time,
            timeZone,
            reason,
            createdAt: Timestamp.now(),
            isDemo: true
        });

        return true;
    } catch (error) {
        console.error('Error blocking time slot:', error);
        throw error;
    }
};

export const unblockTimeSlot = async (slotId) => {
    try {
        await deleteDoc(doc(blockedSlotsCollection, slotId));
        return true;
    } catch (error) {
        console.error('Error unblocking time slot:', error);
        throw error;
    }
};
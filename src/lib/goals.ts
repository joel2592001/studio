import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Goal } from './types';

const GOALS_COLLECTION = 'goals';

// Function to convert Firestore timestamp to Date and vice versa
const convertTimestamp = (data: any) => {
    if (data.deadline && data.deadline instanceof Timestamp) {
        return {
            ...data,
            deadline: data.deadline.toDate(),
        };
    }
    return data;
};


export const getGoals = async (uid: string): Promise<Goal[]> => {
    const q = query(collection(db, GOALS_COLLECTION), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const goals: Goal[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        goals.push({ id: doc.id, ...convertTimestamp(data) } as Goal);
    });
    return goals;
};

export const addGoal = async (uid: string, goal: Omit<Goal, 'id' | 'uid'>): Promise<Goal> => {
    const goalData: any = {
        ...goal,
        uid,
    };
    if (goal.deadline) {
        goalData.deadline = Timestamp.fromDate(goal.deadline as Date);
    }
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), goalData);
    return { id: docRef.id, uid, ...goal } as Goal;
};

export const updateGoal = async (goal: Goal): Promise<Goal> => {
    const goalRef = doc(db, GOALS_COLLECTION, goal.id);
    const goalData: any = { ...goal };
    if (goal.deadline && goal.deadline instanceof Date) {
        goalData.deadline = Timestamp.fromDate(goal.deadline);
    }
    await updateDoc(goalRef, goalData);
    return goal;
}

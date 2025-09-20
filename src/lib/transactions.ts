import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Transaction } from './types';

const TRANSACTIONS_COLLECTION = 'transactions';

// Function to convert Firestore timestamp to Date and vice versa
const convertTimestamp = (data: any) => {
    const { date, ...rest } = data;
    return {
        ...rest,
        date: date instanceof Timestamp ? date.toDate() : date,
    };
};

export const getTransactions = async (uid: string): Promise<Transaction[]> => {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactions.push({ id: doc.id, ...convertTimestamp(data) } as Transaction);
    });
    return transactions;
};

export const addTransaction = async (uid: string, transaction: Omit<Transaction, 'id' | 'uid'>): Promise<Transaction> => {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
        ...transaction,
        uid,
        date: Timestamp.fromDate(transaction.date as Date),
    });
    return { id: docRef.id, uid, ...transaction } as Transaction;
};

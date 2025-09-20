import { Timestamp } from 'firebase/firestore';

export type Transaction = {
  id: string;
  uid: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: Date | Timestamp;
  description: string;
};

export type Goal = {
  id:string;
  uid: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | Timestamp;
};

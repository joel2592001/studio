'use client';

import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { type Transaction, type Goal } from '@/lib/types';
import { Logo } from '@/components/logo';

const staticTransactions: Transaction[] = [
    {
        id: '1',
        uid: 'static',
        type: 'income',
        category: 'Salary',
        amount: 50000,
        date: new Date('2024-05-01'),
        description: 'Monthly Salary'
    },
    {
        id: '2',
        uid: 'static',
        type: 'expense',
        category: 'Groceries',
        amount: 4500,
        date: new Date('2024-05-05'),
        description: 'Weekly grocery shopping'
    },
    {
        id: '3',
        uid: 'static',
        type: 'expense',
        category: 'Utilities',
        amount: 2000,
        date: new Date('2024-05-06'),
        description: 'Electricity Bill'
    },
    {
        id: '4',
        uid: 'static',
        type: 'expense',
        category: 'Dining Out',
        amount: 1500,
        date: new Date('2024-05-07'),
        description: 'Dinner with friends'
    },
    {
        id: '5',
        uid: 'static',
        type: 'expense',
        category: 'Transport',
        amount: 1200,
        date: new Date('2024-05-10'),
        description: 'Monthly metro pass'
    },
    {
        id: '6',
        uid: 'static',
        type: 'income',
        category: 'Freelance',
        amount: 10000,
        date: new Date('2024-05-12'),
        description: 'Freelance project payment'
    },
    {
        id: '7',
        uid: 'static',
        type: 'expense',
        category: 'Entertainment',
        amount: 800,
        date: new Date('2024-05-15'),
        description: 'Movie tickets'
    }
];

const staticGoals: Goal[] = [
    {
        id: 'g1',
        uid: 'static',
        name: 'Vacation to Goa',
        targetAmount: 50000,
        currentAmount: 15000,
        deadline: new Date('2024-12-31')
    },
    {
        id: 'g2',
        uid: 'static',
        name: 'New Laptop',
        targetAmount: 120000,
        currentAmount: 80000,
        deadline: new Date('2024-09-30')
    },
    {
        id: 'g3',
        uid: 'static',
        name: 'Emergency Fund',
        targetAmount: 200000,
        currentAmount: 150000,
    }
];


type State = {
  transactions: Transaction[];
  goals: Goal[];
};

type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal };

const initialState: State = {
  transactions: staticTransactions,
  goals: staticGoals,
};

function financialReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };
    case 'UPDATE_GOAL':
        return {
            ...state,
            goals: state.goals.map(goal => 
                goal.id === action.payload.id ? action.payload : goal
            ),
        };
    default:
      return state;
  }
}

const FinancialContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'uid'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'uid'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
} | null>(null);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);
  const [loading, setLoading] = useState(false);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'uid'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID(), uid: 'static' } as Transaction;
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };
  
  const addGoal = async (goal: Omit<Goal, 'id' | 'uid'>) => {
     const newGoal = { ...goal, id: crypto.randomUUID(), uid: 'static' } as Goal;
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };
  
  const updateGoal = async (goal: Goal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: goal });
  };

  if (loading) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
            <Logo />
            <p className="mt-4 text-muted-foreground">Loading Financial Data...</p>
        </div>
    )
  }

  return (
    <FinancialContext.Provider value={{ state, dispatch, addTransaction, addGoal, updateGoal }}>
      {children}
    </FinancialContext.Provider>
  );
};

export function useFinancials() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancials must be used within a FinancialProvider');
  }
  return context;
}

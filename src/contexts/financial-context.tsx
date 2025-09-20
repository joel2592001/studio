'use client';

import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { type Transaction, type Goal } from '@/lib/types';
import { Logo } from '@/components/logo';

const staticTransactions: Transaction[] = [];

const staticGoals: Goal[] = [];


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

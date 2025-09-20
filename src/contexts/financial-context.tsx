'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { type Transaction, type Goal } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { getTransactions, addTransaction as addTransactionService } from '@/lib/transactions';
import { getGoals, addGoal as addGoalService, updateGoal as updateGoalService } from '@/lib/goals';
import { Logo } from '@/components/logo';

type State = {
  transactions: Transaction[];
  goals: Goal[];
  loading: boolean;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal };

const initialState: State = {
  transactions: [],
  goals: [],
  loading: true,
};

function financialReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
        return { ...state, loading: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'SET_GOALS':
        return { ...state, goals: action.payload };
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
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const [transactions, goals] = await Promise.all([
            getTransactions(user.uid),
            getGoals(user.uid)
          ]);
          dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
          dispatch({ type: 'SET_GOALS', payload: goals });
        } catch (error) {
          console.error("Failed to fetch financial data:", error);
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    }
    fetchData();
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'uid'>) => {
    if (!user) throw new Error("User not authenticated");
    const newTransaction = await addTransactionService(user.uid, transaction);
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };
  
  const addGoal = async (goal: Omit<Goal, 'id' | 'uid'>) => {
    if (!user) throw new Error("User not authenticated");
    const newGoal = await addGoalService(user.uid, goal);
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
  };
  
  const updateGoal = async (goal: Goal) => {
    if (!user) throw new Error("User not authenticated");
    const updatedGoal = await updateGoalService(goal);
    dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
  };

  if (state.loading) {
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

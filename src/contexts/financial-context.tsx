'use client';

import { type Transaction, type Goal } from '@/lib/types';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type State = {
  transactions: Transaction[];
  goals: Goal[];
};

type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal };

const initialState: State = {
  transactions: [
    { id: '1', type: 'income', category: 'Salary', amount: 400000, date: new Date('2024-07-01'), description: 'Monthly Salary' },
    { id: '2', type: 'expense', category: 'Groceries', amount: 12000, date: new Date('2024-07-05'), description: 'Weekly grocery shopping' },
    { id: '3', type: 'expense', category: 'Utilities', amount: 8000, date: new Date('2024-07-10'), description: 'Electricity Bill' },
    { id: '4', type: 'expense', category: 'Transport', amount: 5000, date: new Date('2024-07-12'), description: 'Gasoline' },
    { id: '5', type: 'income', category: 'Freelance', amount: 60000, date: new Date('2024-07-15'), description: 'Web design project' },
    { id: '6', type: 'expense', category: 'Dining Out', amount: 6000, date: new Date('2024-07-18'), description: 'Dinner with friends' },
  ],
  goals: [
    { id: '1', name: 'Vacation to Goa', targetAmount: 320000, currentAmount: 120000, deadline: new Date('2025-06-01') },
    { id: '2', name: 'New Laptop', targetAmount: 160000, currentAmount: 144000, deadline: new Date('2024-09-01') },
  ],
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
} | null>(null);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  return (
    <FinancialContext.Provider value={{ state, dispatch }}>
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

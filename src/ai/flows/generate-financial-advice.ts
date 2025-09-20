'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized financial advice based on user data.
 *
 * The flow takes income, expenses, and savings data as input and returns financial advice.
 * It exports:
 * - `generateFinancialAdvice`: The main function to trigger the flow.
 * - `FinancialAdviceInput`: The input type for the flow.
 * - `FinancialAdviceOutput`: The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the financial advice flow
const FinancialAdviceInputSchema = z.object({
  income: z.number().describe('The user\u2019s total income.'),
  expenses: z.number().describe('The user\u2019s total expenses.'),
  savings: z.number().describe('The user\u2019s total savings.'),
});

export type FinancialAdviceInput = z.infer<typeof FinancialAdviceInputSchema>;

// Define the output schema for the financial advice flow
const FinancialAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized financial advice based on the user\u2019s data.'),
});

export type FinancialAdviceOutput = z.infer<typeof FinancialAdviceOutputSchema>;

// Define the Genkit prompt
const financialAdvicePrompt = ai.definePrompt({
  name: 'financialAdvicePrompt',
  input: {schema: FinancialAdviceInputSchema},
  output: {schema: FinancialAdviceOutputSchema},
  prompt: `You are a personal finance advisor. Based on the user's financial data, provide personalized and actionable advice.

  Income: {{{income}}}
  Expenses: {{{expenses}}}
  Savings: {{{savings}}}

  Provide specific recommendations for improving their financial situation, such as budgeting tips, saving strategies, and investment options.`,
});

// Define the Genkit flow
const generateFinancialAdviceFlow = ai.defineFlow(
  {
    name: 'generateFinancialAdviceFlow',
    inputSchema: FinancialAdviceInputSchema,
    outputSchema: FinancialAdviceOutputSchema,
  },
  async input => {
    const {output} = await financialAdvicePrompt(input);
    return output!;
  }
);

/**
 * Generates personalized financial advice based on user's income, expenses, and savings data.
 * @param input - The input data containing income, expenses, and savings.
 * @returns A promise that resolves to an object containing the financial advice.
 */
export async function generateFinancialAdvice(input: FinancialAdviceInput): Promise<FinancialAdviceOutput> {
  return generateFinancialAdviceFlow(input);
}

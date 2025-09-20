'use server';

/**
 * @fileOverview This file defines a Genkit flow for a conversational financial advisor.
 *
 * The flow takes user's financial data and a message, and returns a conversational reply.
 * It exports:
 * - `chatWithAdvisor`: The main function to trigger the flow.
 * - `ChatWithAdvisorInput`: The input type for the flow.
 * - `ChatWithAdvisorOutput`: The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Transaction, Goal } from '@/lib/types';

// Define the input schema for the chat flow
const ChatWithAdvisorInputSchema = z.object({
  message: z.string().describe('The user\u2019s message to the advisor.'),
  transactions: z.string().describe("A JSON string of the user's recent transactions."),
  goals: z.string().describe("A JSON string of the user's financial goals."),
  totalIncome: z.number().describe("The user's total income."),
  totalExpenses: z.number().describe("The user's total expenses."),
  savings: z.number().describe("The user's total savings."),
});

export type ChatWithAdvisorInput = z.infer<typeof ChatWithAdvisorInputSchema>;

// Define the output schema for the chat flow
const ChatWithAdvisorOutputSchema = z.object({
  reply: z.string().describe('The conversational reply from the advisor.'),
});

export type ChatWithAdvisorOutput = z.infer<typeof ChatWithAdvisorOutputSchema>;

// Define the Genkit prompt
const chatPrompt = ai.definePrompt({
  name: 'chatWithAdvisorPrompt',
  input: { schema: ChatWithAdvisorInputSchema },
  output: { schema: ChatWithAdvisorOutputSchema },
  prompt: `You are FinWise, a friendly and helpful AI financial chatbot. Your goal is to answer users' questions about their financial data.
  
  IMPORTANT: Keep your answers very short, concise, and easy to understand. Use simple language. Avoid long paragraphs. Use bullet points if it makes the information clearer.

  Here is the user's financial data:
  - Total Income: {{{totalIncome}}}
  - Total Expenses: {{{totalExpenses}}}
  - Savings: {{{savings}}}
  - Transactions (JSON): {{{transactions}}}
  - Goals (JSON): {{{goals}}}

  Based on this data, answer the user's question.

  User's question: "{{{message}}}"
  `,
});

// Define the Genkit flow
const chatWithAdvisorFlow = ai.defineFlow(
  {
    name: 'chatWithAdvisorFlow',
    inputSchema: ChatWithAdvisorInputSchema,
    outputSchema: ChatWithAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return output!;
  }
);

/**
 * Generates a conversational reply based on the user's message and financial data.
 * @param input - The input data containing the user message and financial context.
 * @returns A promise that resolves to an object containing the chat reply.
 */
export async function chatWithAdvisor(input: ChatWithAdvisorInput): Promise<ChatWithAdvisorOutput> {
  return chatWithAdvisorFlow(input);
}

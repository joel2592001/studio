'use server';

import { generateFinancialAdvice, FinancialAdviceInput } from "@/ai/flows/generate-financial-advice";

export async function getFinancialAdviceAction(input: FinancialAdviceInput) {
  try {
    const result = await generateFinancialAdvice(input);
    return { advice: result.advice, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { advice: null, error: `Failed to generate advice: ${errorMessage}` };
  }
}

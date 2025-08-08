'use server';
/**
 * @fileOverview Flow to generate a funny user bio based on their quiz answers.
 *
 * - generateBioFromQuiz - A function that generates a bio from quiz answers.
 * - GenerateBioFromQuizInput - The input type for the generateBioFromQuiz function.
 * - GenerateBioFromQuizOutput - The return type for the generateBioFromQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionAndAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const GenerateBioFromQuizInputSchema = z.object({
  questionsAndAnswers: z.array(QuestionAndAnswerSchema).describe('A list of questions and the user\'s answers.'),
});
export type GenerateBioFromQuizInput = z.infer<typeof GenerateBioFromQuizInputSchema>;

const GenerateBioFromQuizOutputSchema = z.object({
  bio: z.string().describe('A new, short, funny, and slightly absurd bio for a dating profile, generated from the quiz answers.'),
});
export type GenerateBioFromQuizOutput = z.infer<typeof GenerateBioFromQuizOutputSchema>;

export async function generateBioFromQuiz(input: GenerateBioFromQuizInput): Promise<GenerateBioFromQuizOutput> {
  return generateBioFromQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBioFromQuizPrompt',
  input: {schema: GenerateBioFromQuizInputSchema},
  output: {schema: GenerateBioFromQuizOutputSchema},
  prompt: `You are a sarcastic AI assistant for a dating app called "Love404". Your task is to generate a new, short, and funny bio for a user based on their answers to a personality quiz. The bio should be humorous and slightly absurd.

Here are the user's answers:
{{#each questionsAndAnswers}}
- Question: {{this.question}}
- Answer: {{this.answer}}
{{/each}}

Based on these answers, write a new, single-sentence bio for their dating profile. Do not refer to the questions or answers directly.`,
});

const generateBioFromQuizFlow = ai.defineFlow(
  {
    name: 'generateBioFromQuizFlow',
    inputSchema: GenerateBioFromQuizInputSchema,
    outputSchema: GenerateBioFromQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

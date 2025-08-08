'use server';
/**
 * @fileOverview Flow to generate a funny and absurd quiz question.
 *
 * - generateQuizQuestion - A function that generates a quiz question.
 * - QuizQuestionOutput - The return type for the generateQuizQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionOutputSchema = z.object({
  question: z
    .string()
    .describe(
      'A funny and absurd personality quiz question for a dating app with a dark sense of humor.'
    ),
  options: z
    .array(z.string())
    .length(3)
    .describe('An array of 3 funny and absurd options for the question.'),
});
export type QuizQuestionOutput = z.infer<typeof QuizQuestionOutputSchema>;

export async function generateQuizQuestion(): Promise<QuizQuestionOutput> {
  return generateQuizQuestionFlow();
}

const prompt = ai.definePrompt({
  name: 'quizQuestionPrompt',
  output: {schema: QuizQuestionOutputSchema},
  prompt: `You are a creative AI for a satirical dating app called "Love404" with a dark sense of humor. Your task is to generate a single, funny, and nonsensical personality quiz question with three equally absurd multiple-choice answers.

The goal is to be weird and humorous, not to actually assess personality.

Example:
Question: "What's your favorite way to pass the time?"
Options: ["Contemplating the heat death of the universe", "Staring into the void until it stares back", "Organizing my collection of existential dread memes"]

Generate a new question and options.`,
});

const generateQuizQuestionFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionFlow',
    outputSchema: QuizQuestionOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);

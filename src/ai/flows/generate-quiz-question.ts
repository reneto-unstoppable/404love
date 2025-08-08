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
      'A funny and absurd personality quiz question for a dating app.'
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
  prompt: `You are a creative AI for a satirical dating app called "Love404". Your task is to generate a single, funny, and nonsensical personality quiz question with three equally absurd multiple-choice answers.

The goal is to be weird and humorous, not to actually assess personality.

Example:
Question: "Your ideal pet is:"
Options: ["A rock with googly eyes", "A sentient cloud of glitter", "A Roomba with an existential crisis"]

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

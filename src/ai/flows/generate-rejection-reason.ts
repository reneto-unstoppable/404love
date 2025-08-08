'use server';
/**
 * @fileOverview Flow to generate a funny rejection reason.
 *
 * - generateRejectionReason - A function that generates a funny rejection reason.
 * - RejectionReasonInput - The input type for the generateRejectionReason function.
 * - RejectionReasonOutput - The return type for the generateRejectionReason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RejectionReasonInputSchema = z.object({
  userName: z.string().describe('The name of the user being rejected.'),
  profileName: z.string().describe("The name of the profile that is rejecting the user."),
});
export type RejectionReasonInput = z.infer<typeof RejectionReasonInputSchema>;

const RejectionReasonOutputSchema = z.object({
  reason: z.string().describe('A unique, funny, and slightly absurd reason for rejection.'),
});
export type RejectionReasonOutput = z.infer<typeof RejectionReasonOutputSchema>;

export async function generateRejectionReason(input: RejectionReasonInput): Promise<RejectionReasonOutput> {
  return generateRejectionReasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rejectionReasonPrompt',
  input: {schema: RejectionReasonInputSchema},
  output: {schema: RejectionReasonOutputSchema},
  prompt: `You are a hilariously cruel AI for a dating app called "Love404". Your job is to come up with a funny, creative, and slightly absurd reason why {{{profileName}}} would reject {{{userName}}}.

Keep it to a single sentence. Be as ridiculous as possible.

Examples:
- "They can't date you, they're busy converting their apartment into a ball pit."
- "Sorry, your aura is incompatible with their pet rock's."
- "They have a strict policy against dating anyone who has ever seen a pigeon."

Generate a new rejection reason for the following user:
User being rejected: {{{userName}}}
Rejecting profile: {{{profileName}}}
`,
});

const generateRejectionReasonFlow = ai.defineFlow(
  {
    name: 'generateRejectionReasonFlow',
    inputSchema: RejectionReasonInputSchema,
    outputSchema: RejectionReasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview Flow to generate strange quirks for user profiles.
 *
 * - generateProfileQuirks - A function that generates a set of strange quirks for a user profile.
 * - ProfileQuirksInput - The input type for the generateProfileQuirks function.
 * - ProfileQuirksOutput - The return type for the generateProfileQuirks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileQuirksInputSchema = z.object({
  profileDescription: z
    .string()
    .describe('A description of the user profile.'),
});
export type ProfileQuirksInput = z.infer<typeof ProfileQuirksInputSchema>;

const ProfileQuirksOutputSchema = z.object({
  quirks: z
    .array(z.string())
    .describe('A list of strange and funny quirks for the profile.'),
});
export type ProfileQuirksOutput = z.infer<typeof ProfileQuirksOutputSchema>;

export async function generateProfileQuirks(input: ProfileQuirksInput): Promise<ProfileQuirksOutput> {
  return generateProfileQuirksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileQuirksPrompt',
  input: {schema: ProfileQuirksInputSchema},
  output: {schema: ProfileQuirksOutputSchema},
  prompt: `You are a quirky AI assistant designed to generate strange and funny quirks for dating profiles.

  Given the following profile description, generate a list of 3-5 quirks that would make the profile more interesting and humorous. These quirks should be unexpected and slightly absurd.

  Profile Description: {{{profileDescription}}}

  Quirks:`,
});

const generateProfileQuirksFlow = ai.defineFlow(
  {
    name: 'generateProfileQuirksFlow',
    inputSchema: ProfileQuirksInputSchema,
    outputSchema: ProfileQuirksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

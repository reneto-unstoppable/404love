"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateProfileQuirks } from '@/ai/flows/generate-profile-quirks';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const profileFormSchema = z.object({
  displayName: z.string().optional(),
  emotionalAge: z.coerce.number({invalid_type_error: "Please enter a number."}).min(0, "Age can't be negative.").max(1000, "Are you a vampire?"),
  favoriteConspiracy: z.string().min(3, "Surely you can think of something better."),
  spiritVegetable: z.string().min(2, "Even a potato is better than nothing."),
  loveLanguage: z.enum(['sarcasm', 'ghosting']),
  believesInLove: z.boolean().default(false).optional(),
  profileDescription: z.string().min(10, "Give us something to work with.").max(200, "This isn't your diary."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{username: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
        router.push('/');
    }
  }, [router]);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      loveLanguage: 'sarcasm',
      believesInLove: true,
      emotionalAge: 27,
      favoriteConspiracy: "The moon is a projection",
      spiritVegetable: "A forlorn carrot",
      profileDescription: "I enjoy long, awkward silences and pretending to read books in public.",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    const profileDescription = `
      Display Name: ${data.displayName || `HotSingle_${Math.floor(Math.random() * 900) + 100}`}
      Emotional Age: ${data.emotionalAge}
      Favorite Conspiracy: ${data.favoriteConspiracy}
      Spirit Vegetable: ${data.spiritVegetable}
      Love Language: ${data.loveLanguage}
      Believes in love at first site: ${data.believesInLove ? 'Yes' : 'No'}
      Profile Description: ${data.profileDescription}
    `;

    try {
      const { quirks } = await generateProfileQuirks({ profileDescription });
      const profileData = {
        ...data,
        quirks,
        displayName: data.displayName || `HotSingle_${Math.floor(Math.random() * 900) + 100}`,
      };
      
      localStorage.setItem('profile', JSON.stringify(profileData));
      router.push('/quiz');
    } catch (error) {
      console.error("Failed to generate quirks:", error);
      const profileData = {
        ...data,
        quirks: ["Collects lint as a hobby.", "Thinks cilantro tastes like soap... and loves it."],
        displayName: data.displayName || `HotSingle_${Math.floor(Math.random() * 900) + 100}`,
      };
      localStorage.setItem('profile', JSON.stringify(profileData));
      router.push('/quiz');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
            <CardTitle>Welcome, {user?.username || 'Mysterious Stranger'}</CardTitle>
            <CardDescription>Time to build your profile. Don't worry, we'll judge you silently.</CardDescription>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col items-center gap-4">
                 <Image src="https://placehold.co/128x128.png" alt="Glitched profile" width={128} height={128} className="rounded-full border-4 border-primary filter saturate-200 contrast-150 brightness-90 hue-rotate-15" data-ai-hint="abstract portrait" />
                 <p className="text-sm text-muted-foreground">Your AI-generated, slightly unsettling new face.</p>
            </div>
           
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="HotSingle_420" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emotionalAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 7 or 700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="favoriteConspiracy"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Favorite Conspiracy Theory</FormLabel>
                  <FormControl>
                    <Input placeholder="Birds aren't real" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spiritVegetable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spirit Vegetable</FormLabel>
                  <FormControl>
                    <Input placeholder="A melancholic turnip" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loveLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Love Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your language of love" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sarcasm">Sarcasm</SelectItem>
                      <SelectItem value="ghosting">Ghosting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Bio / Warning Label</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe yourself in a way that lowers expectations..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="believesInLove"
              render={({ field }) => (
                <FormItem className="md:col-span-2 flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Do you believe in love at first site?</FormLabel>
                    <FormDescription>(Yes, the typo is intentional. No, it's not a test.)</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quirks...
              </> : 'Analyze My Life Choices'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

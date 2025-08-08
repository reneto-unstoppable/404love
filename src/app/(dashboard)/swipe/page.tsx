'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { generateRejectionReason } from '@/ai/flows/generate-rejection-reason';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ghost, Loader2, Heart, ThumbsDown, CalendarPlus } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const initialProfiles = [
    { name: 'Clippy', age: 25, bio: 'It looks like you\'re trying to find love. Would you like some unsolicited advice?', image: 'https://placehold.co/128x128.png', dataAiHint: 'office supplies' },
    { name: 'A Sentient Toaster', age: 3, bio: 'Looking for someone to share my warmth with. I make great toast. That\'s it.', image: 'https://placehold.co/128x128.png', dataAiHint: 'toaster cartoon' },
    { name: 'Kevin', age: 32, bio: 'I own 17 ferrets. This is not a joke. Please help.', image: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait' },
    { name: 'The Void', age: '???', bio: 'Stare into me and I\'ll stare back. We can listen to sad music together.', image: 'https://placehold.co/128x128.png', dataAiHint: 'black hole' },
    { name: 'A Single Shoe', age: 1, bio: 'I\'m a left shoe looking for my sole mate. Must be a righty.', image: 'https://placehold.co/128x128.png', dataAiHint: 'single shoe'},
    { name: 'Person_Who_Peaked_In_High_School', age: 34, bio: 'I was the quarterback of the football team. I can throw this pigskin over them mountains.', image: 'https://placehold.co/128x128.png', dataAiHint: 'football player'},
    { name: 'The_Robot', age: 2, bio: 'Processing... Love... is an illogical, inefficient human emotion. I must understand it.', image: 'https://placehold.co/128x128.png', dataAiHint: 'robot face'},
    { name: 'Ghost of Boyfriends Past', age: 152, bio: 'I\'ll probably leave you on read for a few centuries.', image: 'https://placehold.co/128x128.png', dataAiHint: 'ghost'},
];

type Profile = {
    name: string;
    age: number | string;
    bio: string;
    image: string;
    dataAiHint: string;
};

export default function GalleryPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [isLoading, setIsLoading] = useState(false);
    const [askingDate, setAskingDate] = useState<string | null>(null);
    const [user, setUser] = useState<{username: string} | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            router.push('/');
          }
        }
    }, [router]);

    const handleAction = (profile: Profile, action: 'like' | 'dislike') => {
      if (typeof window !== 'undefined') {
        const key = action === 'like' ? 'likedProfiles' : 'dislikedProfiles';
        const otherKey = action === 'like' ? 'dislikedProfiles' : 'likedProfiles';
        
        const currentList: Profile[] = JSON.parse(localStorage.getItem(key) || '[]');
        const otherList: Profile[] = JSON.parse(localStorage.getItem(otherKey) || '[]');

        if (!currentList.some(p => p.name === profile.name)) {
          localStorage.setItem(key, JSON.stringify([...currentList, profile]));
        }

        localStorage.setItem(otherKey, JSON.stringify(otherList.filter(p => p.name !== profile.name)));
        
        toast({ title: `You ${action}d ${profile.name.replace(/_/g, ' ')}!`, description: "Your choice has been recorded for future judgment."});
      }
    };

    const handleAskForDate = async (profile: Profile) => {
        setAskingDate(profile.name);
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const { reason } = await generateRejectionReason({
                userName: user?.username || "Someone",
                profileName: profile.name.replace(/_/g, ' '),
            });
            toast({
                title: 'It\'s not you, it\'s them.',
                description: reason,
                variant: 'destructive',
                duration: 9000,
            });
            const currentRejections = parseInt(localStorage.getItem('rejectionCount') || '0', 10);
            localStorage.setItem('rejectionCount', JSON.stringify(currentRejections + 1));
        } catch (error) {
            console.error("AI failed to be mean:", error);
            toast({
                title: 'Rejection Error',
                description: "They rejected you so hard it broke our AI. Congratulations?",
                variant: 'destructive',
                duration: 9000,
            });
        } finally {
            setAskingDate(null);
        }
    };


    if (!user) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-background text-primary">
                <Loader2 className="h-16 w-16 animate-spin mb-4" />
                <h1 className="font-headline text-2xl">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen p-4 md:p-8">
            <main className="flex-grow">
                <div className="text-center mb-8">
                    <Ghost className="w-12 h-12 text-primary mx-auto mb-2"/>
                    <h2 className="font-headline text-4xl font-bold">Behold! The Gallery of Ghosters</h2>
                    <p className="text-muted-foreground mt-2">A curated collection of digital specters and romantic dead-ends. Choose wisely. Or don't.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {profiles.map((profile) => (
                        <Card key={profile.name} className="flex flex-col items-center text-center p-4 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                             <Image src={profile.image} alt={profile.name} width={128} height={128} className="rounded-full border-4 border-primary/50 mb-4" data-ai-hint={profile.dataAiHint} />
                            <CardHeader className="p-0 mb-2">
                                <CardTitle className="font-headline text-xl">{profile.name.replace(/_/g, ' ')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mb-4 flex-grow">
                                <p className="text-muted-foreground text-sm">
                                    {profile.bio}
                                </p>
                            </CardContent>
                             <CardFooter className="w-full flex justify-center gap-2 p-0">
                                <Button variant="outline" size="icon" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" onClick={() => handleAction(profile, 'like')}><Heart /></Button>
                                <Button variant="destructive" className="flex-grow" onClick={() => handleAskForDate(profile)} disabled={askingDate !== null}>
                                    {askingDate === profile.name ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Asking...
                                        </>
                                    ) : (
                                       <><CalendarPlus className="mr-2"/> Ask For Date </> 
                                    )}
                                </Button>
                                <Button variant="outline" size="icon" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" onClick={() => handleAction(profile, 'dislike')}><ThumbsDown /></Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

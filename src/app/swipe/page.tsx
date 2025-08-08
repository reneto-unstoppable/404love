"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { generateProfileQuirks } from '@/ai/flows/generate-profile-quirks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { HeartCrack, Loader2, ThumbsDown, ThumbsUp, Shuffle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const initialProfiles = [
    { name: 'Clippy', age: 25, bio: 'It looks like you\'re trying to find love. Would you like some unsolicited advice?', image: 'https://placehold.co/400x400.png', dataAiHint: 'office supplies', desc: 'A helpful but ultimately annoying office assistant.' },
    { name: 'A Sentient Toaster', age: 3, bio: 'Looking for someone to share my warmth with. I make great toast. That\'s it.', image: 'https://placehold.co/400x400.png', dataAiHint: 'toaster cartoon', desc: 'A kitchen appliance with feelings.' },
    { name: 'Kevin', age: 32, bio: 'I own 17 ferrets. This is not a joke. Please help.', image: 'https://placehold.co/400x400.png', dataAiHint: 'man portrait', desc: 'A man overwhelmed by his life choices.' },
    { name: 'The Void', age: '???', bio: 'Stare into me and I\'ll stare back. We can listen to sad music together.', image: 'https://placehold.co/400x400.png', dataAiHint: 'black hole', desc: 'An endless expanse of nothingness, but with good taste in music.' },
];

const failureMessages = [
    { title: "404: Match Not Found", description: "The server of love has crashed. Please try another lifetime." },
    { title: "Incompatible Forever!", description: "You are 110% incompatible. Congratulations on this remarkable achievement." },
    { title: "You Matched With: NULL", description: "Your love life is a bug we can't seem to fix. Sorry." },
    { title: "Error: Soulmate.exe not found", description: "Did you mean to apply to therapy instead? Just asking." },
];

const chaosAlerts = [
    "Your soulmate is buffering...",
    "Your emotional baggage exceeds our 8MB limit.",
    "A cute single in your area just adopted 12 cats.",
    "Your last five matches have been arrested.",
    "Updating your profile to 'Undateable'. Please wait.",
];

type Profile = {
    name: string;
    age: number | string;
    bio: string;
    image: string;
    dataAiHint: string;
    quirks: string[];
};

export default function SwipePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFailure, setShowFailure] = useState(false);
    const [failureMessage, setFailureMessage] = useState(failureMessages[0]);
    const [deckKey, setDeckKey] = useState(Date.now());

    const generateAllProfiles = useCallback(async () => {
        setIsLoading(true);
        try {
            if (typeof window !== 'undefined' && !localStorage.getItem('profile')) {
                router.push('/');
                return;
            }

            const generatedProfiles = await Promise.all(
                initialProfiles.map(async (p) => {
                    const { quirks } = await generateProfileQuirks({ profileDescription: p.desc });
                    return { ...p, quirks };
                })
            );
            setProfiles(generatedProfiles);
        } catch (error) {
            console.error("Profile generation failed:", error);
            const fallbackProfiles = initialProfiles.map(p => ({ ...p, quirks: ["Fascinated by wallpaper.", "Believes the earth is donut-shaped."]}));
            setProfiles(fallbackProfiles);
            toast({ title: "AI is on a break", description: "Using backup weirdos.", variant: "destructive"})
        } finally {
            setIsLoading(false);
        }
    }, [router, toast]);

    useEffect(() => {
        generateAllProfiles();
    }, [generateAllProfiles, deckKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomAlert = chaosAlerts[Math.floor(Math.random() * chaosAlerts.length)];
            toast({
                title: "System Alert",
                description: randomAlert,
                variant: 'destructive',
            });
        }, 15000);

        return () => clearInterval(interval);
    }, [toast]);

    const handleSwipe = () => {
        setFailureMessage(failureMessages[Math.floor(Math.random() * failureMessages.length)]);
        setShowFailure(true);
    };

    const handleCloseFailure = () => {
        setShowFailure(false);
        setProfiles(prev => prev.slice(1));
        if (profiles.length <= 1) {
             toast({
                title: "You've run out of people to reject.",
                description: "Refreshing the deck with more disappointment.",
            });
            setDeckKey(Date.now());
        }
    };
    
    const handleUnmatchRoulette = () => {
        toast({
            title: "Unmatch Roulette Activated!",
            description: "The Spirit Vegetable Council has spoken. All your potential (and non-existent) matches have been cleared.",
            variant: "destructive"
        });
        setDeckKey(Date.now());
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-background text-primary">
                <Loader2 className="h-16 w-16 animate-spin mb-4" />
                <h1 className="font-headline text-2xl">Brewing Fresh Disappointments...</h1>
            </div>
        );
    }

    const currentProfile = profiles[0];

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden p-4 md:p-8">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <HeartCrack className="w-8 h-8 text-primary" />
                    <h1 className="font-headline text-3xl font-bold text-primary">Error of the Heart</h1>
                </div>
                <Button onClick={handleUnmatchRoulette} variant="destructive" size="sm">
                    <Shuffle className="mr-2 h-4 w-4"/>
                    Unmatch Roulette
                </Button>
            </header>

            <div className="flex-grow flex items-center justify-center">
                {currentProfile ? (
                    <Card className="w-full max-w-sm h-[75vh] max-h-[600px] flex flex-col shadow-2xl relative overflow-hidden rounded-2xl">
                        <Image src={currentProfile.image} alt={currentProfile.name} layout="fill" objectFit="cover" className="absolute" data-ai-hint={currentProfile.dataAiHint} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        <CardContent className="relative flex flex-col justify-end h-full p-6 text-white z-10">
                            <h2 className="font-headline text-4xl font-bold drop-shadow-lg">{currentProfile.name}, {currentProfile.age}</h2>
                            <p className="text-lg italic mt-2 drop-shadow-md">{currentProfile.bio}</p>
                            <div className="mt-4 border-t border-white/20 pt-4">
                                <h3 className="font-bold mb-2 drop-shadow-md">Quirks:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentProfile.quirks.map((quirk, i) => (
                                        <Badge key={i} variant="secondary" className="bg-primary/50 text-white border-primary/80 backdrop-blur-sm">{quirk}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center">
                        <h2 className="font-headline text-2xl">Out of options...</h2>
                        <p className="text-muted-foreground">Looks like you've disappointed everyone.</p>
                        <Button onClick={() => setDeckKey(Date.now())} className="mt-4">Scrape the barrel</Button>
                    </div>
                )}
            </div>
            
            {currentProfile && (
                <div className="flex justify-center items-center gap-8 mt-6">
                    <Button onClick={handleSwipe} variant="outline" size="lg" className="rounded-full w-20 h-20 bg-destructive/20 border-destructive hover:bg-destructive text-destructive hover:text-white">
                        <ThumbsDown className="w-10 h-10" />
                    </Button>
                    <Button onClick={handleSwipe} variant="outline" size="lg" className="rounded-full w-20 h-20 bg-accent/20 border-accent hover:bg-accent text-accent hover:text-white">
                        <ThumbsUp className="w-10 h-10" />
                    </Button>
                </div>
            )}
            
            <AlertDialog open={showFailure} onOpenChange={setShowFailure}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-headline text-2xl text-destructive">{failureMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {failureMessage.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleCloseFailure}>Embrace Loneliness</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { generateProfileQuirks } from '@/ai/flows/generate-profile-quirks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartCrack, Loader2, Ghost } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

const initialProfiles = [
    { name: 'Clippy', age: 25, bio: 'It looks like you\'re trying to find love. Would you like some unsolicited advice?', image: 'https://placehold.co/128x128.png', dataAiHint: 'office supplies', desc: 'A helpful but ultimately annoying office assistant.' },
    { name: 'A Sentient Toaster', age: 3, bio: 'Looking for someone to share my warmth with. I make great toast. That\'s it.', image: 'https://placehold.co/128x128.png', dataAiHint: 'toaster cartoon', desc: 'A kitchen appliance with feelings.' },
    { name: 'Kevin', age: 32, bio: 'I own 17 ferrets. This is not a joke. Please help.', image: 'https://placehold.co/128x128.png', dataAiHint: 'man portrait', desc: 'A man overwhelmed by his life choices.' },
    { name: 'The Void', age: '???', bio: 'Stare into me and I\'ll stare back. We can listen to sad music together.', image: 'https://placehold.co/128x128.png', dataAiHint: 'black hole', desc: 'An endless expanse of nothingness, but with good taste in music.' },
    { name: 'A Single Shoe', age: 1, bio: 'I\'m a left shoe looking for my sole mate. Must be a righty.', image: 'https://placehold.co/128x128.png', dataAiHint: 'single shoe', desc: 'A lonely shoe.'},
    { name: 'Person_Who_Peaked_In_High_School', age: 34, bio: 'I was the quarterback of the football team. I can throw this pigskin over them mountains.', image: 'https://placehold.co/128x128.png', dataAiHint: 'football player', desc: 'Still wears his letterman jacket.'},
    { name: 'The_Robot', age: 2, bio: 'Processing... Love... is an illogical, inefficient human emotion. I must understand it.', image: 'https://placehold.co/128x128.png', dataAiHint: 'robot face', desc: 'A robot experiencing an existential crisis.'},
    { name: 'Ghost of Boyfriends Past', age: 152, bio: 'I\'ll probably leave you on read for a few centuries.', image: 'https://placehold.co/128x128.png', dataAiHint: 'ghost', desc: 'A literal ghost.'},

];

type Profile = {
    name: string;
    age: number | string;
    bio: string;
    image: string;
    dataAiHint: string;
    desc: string;
    quirks?: string[];
};

export default function GalleryPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && !localStorage.getItem('profile')) {
            router.push('/');
        }
    }, [router]);


    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-background text-primary">
                <Loader2 className="h-16 w-16 animate-spin mb-4" />
                <h1 className="font-headline text-2xl">Brewing Fresh Disappointments...</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background p-4 md:p-8">
             <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <HeartCrack className="w-8 h-8 text-primary" />
                    <h1 className="font-headline text-3xl font-bold text-primary">Love404</h1>
                </div>
            </header>
            
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
                                    {profile.bio.length > 50 ? `${profile.bio.substring(0, 50)}...` : profile.bio}
                                </p>
                            </CardContent>
                            <Button variant="secondary" className="w-full" onClick={() => toast({ title: "Profile Not Available", description: "This person has been deleted from existence. Try someone else.", variant: "destructive" })}>View Profile</Button>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

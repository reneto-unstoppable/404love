'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, User } from 'lucide-react';
import Image from 'next/image';

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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProfiles = initialProfiles.filter(profile =>
    profile.name.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline text-primary mb-2 flex items-center justify-center gap-2">
            <Search className="w-10 h-10" />
            Search for Your Next Mistake
        </h1>
        <p className="text-muted-foreground">Why settle when you can... also not settle, but with more effort?</p>
        <div className="mt-4 max-w-lg mx-auto">
            <Input 
                type="text"
                placeholder="Search by name or bio (e.g., 'toaster' or 'ferrets')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-center"
            />
        </div>
      </header>
      <main className="flex-grow">
        {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {filteredProfiles.map((profile) => (
                    <Card key={profile.name} className="flex flex-col items-center text-center p-4 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                            <Image src={profile.image} alt={profile.name} width={96} height={96} className="rounded-full border-4 border-primary/50 mb-4" data-ai-hint={profile.dataAiHint} />
                        <CardHeader className="p-0 mb-2">
                            <CardTitle className="font-headline text-xl">{profile.name.replace(/_/g, ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mb-4 flex-grow">
                            <p className="text-muted-foreground text-sm">
                                "{profile.bio}"
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground py-16">
                <User className="w-16 h-16 mx-auto mb-4 text-primary/50"/>
                <p>No one found. Either your standards are too high or you're searching for 'happiness'.</p>
                <p>Try searching for something more realistic, like 'sadness' or 'toast'.</p>
            </div>
        )}
      </main>
    </div>
  );
}

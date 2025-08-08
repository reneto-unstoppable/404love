'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsDown, Trash2 } from 'lucide-react';
import Image from 'next/image';

type Profile = {
  name: string;
  age: number | string;
  bio: string;
  image: string;
  dataAiHint: string;
};

export default function ActionsPage() {
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLiked = localStorage.getItem('likedProfiles');
      const storedDisliked = localStorage.getItem('dislikedProfiles');
      if (storedLiked) setLikedProfiles(JSON.parse(storedLiked));
      if (storedDisliked) setDislikedProfiles(JSON.parse(storedDisliked));
    }
  }, []);

  const clearAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('likedProfiles');
      localStorage.removeItem('dislikedProfiles');
    }
    setLikedProfiles([]);
    setDislikedProfiles([]);
  };

  const ProfileList = ({ title, profiles, icon }: { title: string; profiles: Profile[], icon: React.ReactNode }) => (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="flex flex-row items-center gap-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <div key={profile.name} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
              <Image src={profile.image} alt={profile.name} width={40} height={40} className="rounded-full" data-ai-hint={profile.dataAiHint} />
              <span className="font-medium">{profile.name.replace(/_/g, ' ')}</span>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm text-center py-4">No profiles here yet. Go judge some people.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline text-primary mb-2">Your Dubious Decisions</h1>
        <p className="text-muted-foreground">A record of your questionable taste.</p>
      </header>
      <main className="flex-grow flex flex-col md:flex-row gap-8">
        <ProfileList title="Liked Profiles" profiles={likedProfiles} icon={<Heart className="w-6 h-6 text-green-500" />} />
        <ProfileList title="Disliked Profiles" profiles={dislikedProfiles} icon={<ThumbsDown className="w-6 h-6 text-destructive" />} />
      </main>
      <footer className="text-center mt-8">
        <Button variant="destructive" onClick={clearAll}>
          <Trash2 className="mr-2"/>
          Forget Everyone
        </Button>
      </footer>
    </div>
  );
}

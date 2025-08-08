'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type ProfileStats = {
  likes: number;
  rejects: number;
  dislikes: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [stats, setStats] = useState<ProfileStats>({ likes: 0, rejects: 0, dislikes: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const updateStats = () => {
      const rejectionCount = JSON.parse(localStorage.getItem('rejectionCount') || '0');
      const dislikeCount = JSON.parse(localStorage.getItem('dislikeCount') || '0');
      setStats({ likes: 0, rejects: rejectionCount, dislikes: dislikeCount });
    };

    updateStats();
    
    const statsInterval = setInterval(updateStats, 2000); // Check for updates periodically

    const dislikeInterval = setInterval(() => {
      const currentDislikes = parseInt(localStorage.getItem('dislikeCount') || '0', 10);
      const newDislikes = currentDislikes + 1;
      localStorage.setItem('dislikeCount', JSON.stringify(newDislikes));
      updateStats(); 
    }, 10000);

    return () => {
        clearInterval(statsInterval);
        clearInterval(dislikeInterval);
    }
  }, []);

  const chartData = [
    { name: 'Stats', likes: stats.likes, rejects: stats.rejects, dislikes: stats.dislikes },
  ];

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-8 bg-background text-foreground">
      <Card className="w-full max-w-4xl shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
            <Image src="https://placehold.co/128x128.png" alt="User profile" width={128} height={128} className="rounded-full border-4 border-primary mx-auto mb-4" data-ai-hint="abstract portrait"/>
          <CardTitle className="text-4xl font-headline">{user?.username || 'user2'}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Welcome back to the void. Ready for another round of disappointment?
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold text-primary">Your Stats of Sadness</h3>
            <p className="text-lg"><span className="font-semibold text-green-400">{stats.likes}</span> Likes (as expected)</p>
            <p className="text-lg"><span className="font-semibold text-red-400">{stats.rejects}</span> Rejects (more on the way)</p>
            <p className="text-lg"><span className="font-semibold text-yellow-400">{stats.dislikes}</span> Dislikes (no wonder)</p>
          </div>
          <div className="h-[250px] w-full">
            <ChartContainer config={{
                likes: { label: 'Likes', color: 'hsl(var(--chart-2))' },
                rejects: { label: 'Rejects', color: 'hsl(var(--chart-1))' },
                dislikes: { label: 'Dislikes', color: 'hsl(var(--chart-5))' },
            }}>
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
                <Bar dataKey="rejects" fill="var(--color-rejects)" radius={4} />
                <Bar dataKey="dislikes" fill="var(--color-dislikes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

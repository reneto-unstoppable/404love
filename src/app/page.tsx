"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartCrack } from 'lucide-react';

const memeAdjectives = ["Sweet", "Salty", "Spicy", "Crying", "Laughing", "Sleepy", "Grumpy", "Dapper", "Goofy"];
const memeNouns = ["Cabbage", "Potato", "Pigeon", "Noodle", "Waffle", "Pickle", "Spoon", "Ferret"];

const generateMemeName = () => {
  const adj = memeAdjectives[Math.floor(Math.random() * memeAdjectives.length)];
  const noun = memeNouns[Math.floor(Math.random() * memeNouns.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}_${num}`;
};

export default function LoginPage() {
  const router = useRouter();

  const handleAnonymousLogin = () => {
    const username = generateMemeName();
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({ username, isAnonymous: true }));
    }
    router.push('/create-profile');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center text-center mb-8">
        <HeartCrack className="w-16 h-16 text-primary mb-4" />
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">Love404</h1>
        <p className="text-muted-foreground mt-2 text-lg">Where love is not found... just a 404 error.</p>
      </div>

      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Find Your Non-Soulmate</CardTitle>
          <CardDescription>Or don't. We don't really care.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username (Optional, we'll ignore it)</Label>
            <Input id="username" placeholder="YourBestMistake" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password (Will be stored in plain text)</Label>
            <Input id="password" type="password" placeholder="••••••••••••••" />
          </div>
          <Button variant="secondary" className="w-full" onClick={() => alert("Error: Success is not an option.")}>Sign In / Up (Good luck)</Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or embrace the chaos</span>
            </div>
          </div>
          <Button className="w-full" onClick={handleAnonymousLogin}>
            Go Anonymous
          </Button>
        </CardContent>
      </Card>
       <footer className="mt-8 text-center text-muted-foreground text-sm">
        <p>By using this service you agree to have your heart metaphorically broken.</p>
        <a href="#" className="underline hover:text-primary">Terms and Conditions of Emotional Damage</a>
      </footer>
    </main>
  );
}

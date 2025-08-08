"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function QuizPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(13);
  const [step, setStep] = useState('analyzing'); // analyzing, quiz, result

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('profile')) {
      router.push('/');
      return;
    }

    if (step === 'analyzing') {
      const timer = setTimeout(() => setProgress(66), 500);
      const timer2 = setTimeout(() => setProgress(89), 1500);
      const timer3 = setTimeout(() => setStep('quiz'), 2500);
      return () => {
          clearTimeout(timer);
          clearTimeout(timer2);
          clearTimeout(timer3);
      };
    }
  }, [step, router]);

  const handleQuizSubmit = () => {
    setStep('result');
  };

  const analyzingView = (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Analyzing Life Choices...</CardTitle>
        <CardDescription>This will only hurt a bit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground text-center animate-pulse">Scanning for red flags...</p>
      </CardContent>
    </>
  );

  const quizView = (
     <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Personality... thing</CardTitle>
        <CardDescription>Your answers are very important and will be ignored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
            <h3 className="font-semibold">Which potato shape best represents your dating history?</h3>
            <RadioGroup defaultValue="b">
                <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q1a" /><Label htmlFor="q1a">Perfectly round, symmetrical</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q1b" /><Label htmlFor="q1b">Lumpy, bruised, oddly shaped</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q1c" /><Label htmlFor="q1c">A single, forgotten french fry</Label></div>
            </RadioGroup>
        </div>
         <div className="space-y-4">
            <h3 className="font-semibold">Pick your ideal first date location:</h3>
            <RadioGroup defaultValue="a">
                <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="q2a" /><Label htmlFor="q2a">The DMV</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="b" id="q2b" /><Label htmlFor="q2b">IKEA’s rug aisle</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="c" id="q2c" /><Label htmlFor="q2c">Your ex’s wedding</Label></div>
            </RadioGroup>
        </div>
        <Button className="w-full" onClick={handleQuizSubmit}>See The Damage</Button>
      </CardContent>
    </>
  );

  const resultView = (
    <>
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-destructive">Analysis Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <p className="text-5xl font-bold">3%</p>
            <p className="text-lg text-muted-foreground">compatible with happiness.</p>
            <Button className="w-full" onClick={() => router.push('/swipe')}>Start Swiping Into The Void</Button>
        </CardContent>
    </>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg shadow-2xl">
        {step === 'analyzing' && analyzingView}
        {step === 'quiz' && quizView}
        {step === 'result' && resultView}
      </Card>
    </main>
  );
}

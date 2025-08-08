"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generateQuizQuestion } from '@/ai/flows/generate-quiz-question';
import { Skeleton } from '@/components/ui/skeleton';

type QuizQuestion = {
  question: string;
  options: string[];
};

export default function QuizPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(13);
  const [step, setStep] = useState('analyzing'); // analyzing, quiz, result
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('profile')) {
      router.push('/');
      return;
    }

    if (step === 'analyzing') {
      const timer = setTimeout(() => setProgress(66), 500);
      const timer2 = setTimeout(() => setProgress(89), 1500);
      const timer3 = setTimeout(() => {
        setStep('quiz');
        fetchQuestion();
      }, 2500);
      return () => {
          clearTimeout(timer);
          clearTimeout(timer2);
          clearTimeout(timer3);
      };
    }
  }, [step, router]);

  const fetchQuestion = async () => {
    setIsLoadingQuestion(true);
    try {
      const newQuestion = await generateQuizQuestion();
      setQuestions(prev => [...prev, newQuestion]);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      // Fallback question
      setQuestions(prev => [...prev, {
        question: "Which potato shape best represents your dating history?",
        options: ["Perfectly round, symmetrical", "Lumpy, bruised, oddly shaped", "A single, forgotten french fry"]
      }]);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < 1) { // 2 questions total (0, 1)
      setCurrentQuestionIndex(prev => prev + 1);
      fetchQuestion();
    } else {
      setStep('result');
    }
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
        {isLoadingQuestion && !questions[currentQuestionIndex] ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ) : (
          questions[currentQuestionIndex] && (
            <div className="space-y-4">
                <h3 className="font-semibold">{questions[currentQuestionIndex].question}</h3>
                <RadioGroup defaultValue="b">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={`q${currentQuestionIndex}o${index}`} id={`q${currentQuestionIndex}o${index}`} />
                      <Label htmlFor={`q${currentQuestionIndex}o${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
            </div>
          )
        )}
        <Button className="w-full" onClick={handleNextQuestion} disabled={isLoadingQuestion}>
          {currentQuestionIndex < 1 ? 'Next Question' : 'See The Damage'}
        </Button>
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

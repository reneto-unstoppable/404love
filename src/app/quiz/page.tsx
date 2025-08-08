"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { generateQuizQuestion } from '@/ai/flows/generate-quiz-question';
import { generateBioFromQuiz } from '@/ai/flows/generate-bio-from-quiz';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

type QuizQuestion = {
  question: string;
  options: string[];
};

type QuestionAndAnswer = {
    question: string;
    answer: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('analyzing'); // analyzing, quiz, generating_bio, result
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('profile')) {
      router.push('/');
      return;
    }

    if (step === 'analyzing') {
      const timer = setTimeout(() => setProgress(20), 500);
      const timer2 = setTimeout(() => setProgress(50), 1500);
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

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < 4) { // 5 questions total (0-4)
      setCurrentQuestionIndex(prev => prev + 1);
      setProgress(( (currentQuestionIndex + 1) / 5) * 100);
      if (questions.length <= currentQuestionIndex + 1) {
          fetchQuestion();
      }
    } else {
      setStep('generating_bio');
      setProgress(100);
      
      const questionsAndAnswers: QuestionAndAnswer[] = questions.map((q, i) => ({
          question: q.question,
          answer: answers[i]
      }));

      try {
        const { bio } = await generateBioFromQuiz({ questionsAndAnswers });
        setGeneratedBio(bio);

        const profile = JSON.parse(localStorage.getItem('profile') || '{}');
        profile.profileDescription = bio;
        localStorage.setItem('profile', JSON.stringify(profile));

      } catch (e) {
        console.error("Failed to generate bio", e);
        setGeneratedBio("I'm probably not as interesting as this error message.");
      } finally {
        setStep('result');
      }
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
        <CardDescription>Question {currentQuestionIndex + 1} of 5. Your answers are very important and will be ignored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Progress value={progress} className="w-full" />
        {isLoadingQuestion && !questions[currentQuestionIndex] ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ) : (
          questions[currentQuestionIndex] && (
            <div className="space-y-4 mt-4">
                <h3 className="font-semibold">{questions[currentQuestionIndex].question}</h3>
                <RadioGroup onValueChange={handleAnswerSelect} value={answers[currentQuestionIndex]}>
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${currentQuestionIndex}o${index}`} />
                      <Label htmlFor={`q${currentQuestionIndex}o${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
            </div>
          )
        )}
        <Button className="w-full" onClick={handleNextQuestion} disabled={isLoadingQuestion || !answers[currentQuestionIndex]}>
          {isLoadingQuestion && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {currentQuestionIndex < 4 ? 'Next Question' : 'See The Damage'}
        </Button>
      </CardContent>
    </>
  );

  const generatingBioView = (
     <>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Consulting the Oracle...</CardTitle>
        <CardDescription>We're turning your questionable answers into a personality.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        <p className="text-sm text-muted-foreground text-center animate-pulse">Distilling your essence...</p>
      </CardContent>
    </>
  )

  const resultView = (
    <>
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary">Your New Identity!</CardTitle>
            <CardDescription>This is you now. No take-backs.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <blockquote className="text-lg italic border-l-4 pl-4">"{generatedBio}"</blockquote>
            <Button className="w-full" onClick={() => router.push('/swipe')}>Start Swiping Into The Void</Button>
        </CardContent>
    </>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg shadow-2xl min-h-[350px]">
        {step === 'analyzing' && analyzingView}
        {step === 'quiz' && quizView}
        {step === 'generating_bio' && generatingBioView}
        {step === 'result' && resultView}
      </Card>
    </main>
  );
}

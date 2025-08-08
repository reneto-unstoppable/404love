import { Zap } from 'lucide-react';

export default function ActionsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <Zap className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl font-headline text-primary mb-2">Actions</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  );
}

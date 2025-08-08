import { ProfileForm } from '@/components/profile/ProfileForm';

export default function CreateProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-background">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Craft Your Disasterpiece</h1>
        <p className="text-muted-foreground mt-2 text-lg">Tell us who you're pretending to be.</p>
      </div>
      <ProfileForm />
    </main>
  );
}

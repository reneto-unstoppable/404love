# Love404 - Where love is not found... just a 404 error.

Welcome to Love404, the satirical dating app that embraces the chaos and absurdity of modern romance. This project is a Next.js application built with a dark sense of humor, featuring AI-powered interactions to create a uniquely funny and cynical user experience.

## The Problem (that we all secretly enjoy)

Tired of dating apps promising you a soulmate, only to deliver a stream of awkward conversations and ghosting? We are too. The real problem isn't finding love; it's the crushing disappointment when you don't. So we decided to lean into the chaos.

## The Solution (that nobody asked for)

Introducing Love404, an app that guarantees you'll find... well, not much. Instead of matches, you get witty rejections from an AI. Instead of a personality test, you get a nonsensical quiz that generates a bio you'd never write yourself. It’s all the fun of dating apps, with none of the pressure to actually find someone.

## Technical Details

### Technologies/Components Used

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN/UI](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit) for real-time content generation.
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Implementation

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/love404.git
    ```
2.  **Navigate into the project folder:**
    ```bash
    cd love404
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**
    Create a `.env.local` file in the root and add your Gemini API Key.
    ```


### Run

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Start the Genkit Inspector (in a separate terminal):**
    ```bash
    npm run genkit:dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Project Documentation

### Key Features

- **Anonymous Login**: No need for a real account. Get a randomly generated, meme-worthy username and dive right in.
- **AI-Generated Personality Quiz**: The app generates absurd quiz questions in real-time. Your answers are then used to craft a new, funny, and slightly dark bio for your profile.
- **Creative Rejection Reasons**: When you ask a profile out, our AI generates a unique and humorous reason why it'll never work out.
- **The "Stats of Sadness" Profile Page**: Track your romantic (mis)adventures with a bar chart showing your rejections and dislikes. The dislike count automatically increases over time, because why not?
- **Interactive Swiping**: Like, dislike, or take a leap of faith and ask a profile for a date. All your questionable choices are tracked on the Actions page.

### Workflow

1.  A user logs in anonymously and creates a profile with absurd fields.
2.  The user takes a 5-question quiz with nonsensical, AI-generated questions and options.
3.  Based on the answers, Genkit generates a new, funny bio for the user.
4.  The user can then browse a gallery of equally absurd profiles.
5.  When the user tries to connect with a profile, they receive an AI-generated rejection.
6.  The profile page tracks all these rejections and dislikes in a "Stats of Sadness" chart.


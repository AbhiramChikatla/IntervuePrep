# IntervuePrep

IntervuePrep is an AI-powered mock interview platform built with Next.js App Router. It helps users practice interviews in real time, generate role-specific interview sessions, and receive structured performance feedback.

## Highlights

- Email/password authentication with Firebase Auth
- Persistent user, interview, and feedback data in Firestore
- Real-time voice interview flow powered by Vapi
- AI-generated interview questions using Google Gemini
- AI-generated feedback and scoring across multiple categories
- Modern UI built with Next.js, Tailwind CSS, and reusable components

## Tech Stack

- Framework: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS 4
- Validation and forms: Zod, React Hook Form
- Authentication and database: Firebase Auth, Firestore, Firebase Admin SDK
- AI services:
    - Google Gemini via AI SDK for question and feedback generation
    - Vapi for voice interview interactions

## Project Structure

```text
app/
	(auth)/            # Sign-in and sign-up routes
	(root)/            # Main authenticated app routes
	api/vapi/generate/ # API route for interview generation
components/          # UI and feature components
constants/           # Interviewer config, mappings, schemas
firebase/            # Firebase client and admin setup
lib/actions/         # Server actions for auth and interview logic
types/               # Shared TypeScript definitions
```

## Prerequisites

- Node.js 18.18+ (or 20+ recommended)
- npm 9+
- A Firebase project with Auth and Firestore enabled
- A Vapi account and configured workflow
- A Google AI API key for Gemini

## Environment Variables

Create a .env.local file in the project root and set the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

GOOGLE_GENERATIVE_AI_API_KEY=
```

Notes:

- FIREBASE_PRIVATE_KEY should be the raw private key from your Firebase service account. If your environment escapes new lines, keep them escaped; the app normalizes \n at runtime.
- Firebase project metadata such as authDomain and projectId is currently defined in the client configuration file.

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open the app

```text
http://localhost:3000
```

## Available Scripts

- npm run dev: Start development server with Turbopack
- npm run build: Build for production
- npm run start: Start production server
- npm run lint: Run ESLint checks

## Core Flows

1. Authentication

- Users sign up and sign in with Firebase Auth.
- Session cookies are created server-side for authenticated access.

2. Interview generation

- Users provide role, level, stack, question type, and amount.
- The server route generates questions with Gemini and stores interviews in Firestore.

3. Live interview session

- Vapi initiates a voice interview using assistant settings from the constants module.
- Transcript messages are collected during the call.

4. Feedback generation

- Transcript data is evaluated by Gemini against a strict schema.
- Structured scores, strengths, and improvement areas are stored in Firestore.

## Deployment

Recommended deployment target is Vercel.

Basic production flow:

1. Configure all environment variables in your deployment platform.
2. Build the app:

```bash
npm run build
```

3. Start production server (if self-hosting):

```bash
npm run start
```

## Troubleshooting

- Firebase admin auth errors:
    - Verify FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.
- Gemini request failures:
    - Confirm GOOGLE_GENERATIVE_AI_API_KEY is valid and has quota.
- Vapi call issues:
    - Confirm NEXT_PUBLIC_VAPI_WEB_TOKEN and NEXT_PUBLIC_VAPI_WORKFLOW_ID are set and active.
- Empty interview lists:
    - Check Firestore rules and ensure documents are written to users, interviews, and feedback collections.

## Roadmap Ideas

- Add test coverage for server actions and API routes
- Add role-based interview templates
- Add analytics for interview improvement trends
- Add admin dashboard for content moderation and usage insights

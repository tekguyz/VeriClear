# VeriClear - Advanced Compliance & Audit Dashboard

VeriClear is a modern, AI-powered dashboard designed for call center quality assurance and compliance auditing. It features a sophisticated three-panel layout for efficient workflow, providing tools for live call analysis, asynchronous batch processing, and detailed audit trails.

![VeriClear Screenshot](https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/gallery/vericlear-screenshot.png)

## Key Features

-   **Analytics Dashboard:** At-a-glance view of key metrics like total calls, compliance rates, sentiment scores, and agent performance with trend indicators.
-   **Live Call Analysis:** Real-time audio transcription and agent assistance using the Gemini Live API, with in-call function calling for knowledge base lookups, compliance checks, and escalations.
-   **Batch Processing:** A drag-and-drop interface for uploading audio or text files for asynchronous analysis, powered by Gemini Function Calling and Netlify Functions.
-   **Productivity Tools:** An interactive audit checklist and a notes panel with a real-time event timeline to streamline the auditor's workflow.
-   **Interactive Demo Mode:** A read-only mode pre-populated with mock data to showcase all features without any setup required.
-   **Secure & Robust Backend:** Built on Netlify Functions with centralized security headers, Zod schema validation, and error logging.

## Getting Started & Local Development

To run this project locally, you need to have the [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed. The application's backend is built with Netlify Functions, and the Netlify CLI is required to serve them correctly.

1.  **Install Dependencies:** This project uses a pre-configured `importmap` and does not require a separate `npm install` step for its core dependencies.

2.  **Run the Development Server:** In your project's root directory, run the following command:

    ```bash
    netlify dev
    ```

    This will start a local server (usually on `http://localhost:8888`) that serves the frontend and automatically makes the serverless functions in the `netlify/functions` directory available.

3.  **Access the Application:** Open your browser and navigate to the local server address provided by the Netlify CLI.

> **Note:** If you open the `index.html` file directly in your browser, you will see a "Failed to load dashboard metrics" error. This is expected because the serverless functions are not running. You **must** use `netlify dev` to run the application correctly.

## Project Structure

-   `/components`: Reusable React components (layout, UI elements, etc.).
-   `/features`: Self-contained feature modules (Dashboard, Entry Screen, Help, Settings).
-   `/netlify/functions`: Serverless backend functions for data fetching and analysis.
-   `/netlify/utils`: Shared utilities for the backend functions (e.g., API security).
-   `/store`: Zustand global state management.
-   `/tests`: Placeholder files for unit and integration tests.
-   `index.html`: The main entry point of the application.
-   `App.tsx`: The root React component containing the application's routing logic.

## Technology Stack

-   **Frontend:** React, Tailwind CSS, Lucide React (icons)
-   **State Management:** Zustand
-   **Backend:** Netlify Functions, Netlify Data (PostgreSQL)
-   **AI:** Google Gemini API (`@google/genai`)
-   **Schema Validation:** Zod
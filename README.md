# VeriClear - AI-Powered Call Coaching & Review

VeriClear is a modern, AI-powered dashboard designed for call center quality assurance and coaching. It features a sophisticated three-panel layout for efficient workflow, providing tools for real-time coaching, asynchronous offline reviews, and detailed audit trails.

![VeriClear Screenshot](https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/gallery/vericlear-screenshot.png)

## Key Features

-   **Analytics:** Visualize key metrics, track compliance trends, and gain actionable insights into your team's performance.
-   **Co-Pilot:** Real-time audio transcription and agent assistance using the Gemini Live API, with in-call function calling for knowledge base lookups, compliance checks, and escalations.
-   **Upload:** A drag-and-drop interface for uploading audio or text files for asynchronous analysis, powered by Gemini Function Calling and Netlify Functions.
-   **Reviews:** A centralized repository for all completed analyses, from both live calls and file uploads, with robust filtering and search capabilities.
-   **Productivity Tools:** An interactive review checklist and a notes panel with a real-time event timeline to streamline the reviewer's workflow.
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

## Browser Extension

> **Note:** The browser extension is a planned feature and is currently under development. The code in the `/extension` directory serves as a blueprint for future work. The build process is currently disabled to ensure a stable development experience for the core web application.

## Project Structure

-   `/components`: Reusable React components (layout, UI elements, etc.).
-   `/features`: Self-contained feature modules (Dashboard, Entry Screen, Help, Settings).
-   `/extension`: Source code for the browser extension.
    -   `/dist`: Compiled output files for the extension.
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
# Cheat App

I have built the application as you requested. However, I am unable to run the commands to start it for you.

## To see the application in action, you need to run it on your own machine. Here are the steps:

1.  **Open a terminal** on your computer.
2.  **Navigate to the project directory:** `cd "c:\Users\SUJAL NIMJE\OneDrive\Desktop\cheatApp"`
3.  **Install the necessary packages:** `npm install`
4.  **Set up the Gemini API:**
    *   Get a Gemini API Key from Google AI Studio.
    *   Install the Google Generative AI library: `npm install @google/generative-ai`
    *   Create a new file named `.env.local` in the root of your project.
    *   Add the following line to the `.env.local` file, replacing `YOUR_API_KEY` with your actual key:
        ```
        GEMINI_API_KEY=YOUR_API_KEY
        ```
5.  **Start the application:** `npm run dev`
6.  **Open your browser** and go to `http://localhost:3000`.

You will see a page with a text box where you can paste your quiz content. The application will then process it and show you the extracted questions and the answers found by the Gemini API.

## Important Note:

The application now uses the Gemini API to find the correct answers. You can find the implementation in the `findCorrectAnswer` function in `app/api/get-answer/route.ts`.
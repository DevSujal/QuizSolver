# 🎓 Quiz Answer Finder

An AI-powered web application that helps you find answers to multiple-choice questions instantly using Google's Gemini AI models.

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC)
![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4)

## ✨ Features

- 🤖 **AI-Powered Answers** - Uses Google's Gemini AI to analyze and answer quiz questions
- 🎯 **Batch Processing** - Handles multiple questions in a single request for efficiency
- ⚡ **Three AI Models** - Choose between Gemini 2.5 Pro, Flash, or Flash Lite based on your needs
- 📱 **Mobile-First Design** - Fully responsive UI that works beautifully on all devices
- 🌓 **Dark Mode** - Automatic dark mode support based on system preferences
- 🔄 **Smart Retry Logic** - Handles rate limits gracefully with automatic retries
- 💚 **Clear Answer Display** - Easy-to-read answer cards with visual highlighting
- 🚀 **Fast & Modern** - Built with Next.js 14 and React Server Components

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **Icons & Emojis:** Native Unicode emojis

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher installed
- npm or yarn package manager
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd cheatApp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

To get your Gemini API key:
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env.local` file

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Select AI Model** - Choose from three Gemini models:
   - ⚡ **Flash Lite** - Fastest, best for free tier
   - 🚀 **Flash** - Balanced speed and accuracy
   - 💎 **Pro** - Most accurate for complex questions

2. **Paste Quiz Content** - Copy and paste your quiz questions and options into the text area

3. **Get Answers** - Click the "Get Answers" button to process all questions at once

4. **View Results** - Answers are displayed in clear, highlighted cards with:
   - Question number and text
   - Correct answer(s) highlighted in green
   - Support for multiple correct answers

## 🏗️ Project Structure

```
cheatApp/
├── app/
│   ├── api/
│   │   └── get-answer/
│   │       └── route.ts          # API endpoint for processing questions
│   ├── globals.css                # Global styles and Tailwind config
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Main page component
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in repo)
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## 🔧 Configuration

### AI Models

You can configure which models are available by editing the allowed models in:
- Frontend: `app/page.tsx` (GeminiModel type)
- Backend: `app/api/get-answer/route.ts` (allowedModels array)

### Retry Logic

Rate limit retry behavior can be adjusted in `app/api/get-answer/route.ts`:
- `maxRetries` - Maximum retry attempts (default: 3)
- `delayMs` - Delay calculation for exponential backoff

### Question Parsing

The regex pattern for parsing questions can be customized in the API route:
```typescript
const qaRegex = /(\d+\.\s+Question\s+\d+[\s\S]*?)(?=1 point)/g;
```

## 🚦 API Rate Limits

Google Gemini API has different rate limits based on your tier:

- **Free Tier**: 2 requests per minute (Flash Lite recommended)
- **Paid Tier**: Higher limits based on your plan

The app includes automatic retry logic that:
- Detects 429 rate limit errors
- Reads the `RetryInfo` from the API response
- Waits the suggested delay before retrying
- Uses exponential backoff for retries

## 🎨 Customization

### Theme Colors

Edit the gradient colors in `app/page.tsx`:
```tsx
from-blue-600 to-purple-600  // Change these values
```

### Font

Change the font in `app/layout.tsx`:
```tsx
const inter = Inter({ subsets: ['latin'] })
// Replace with your preferred Google Font
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🐛 Troubleshooting

### "Error fetching from Gemini API"
- Check that your `GEMINI_API_KEY` is correctly set in `.env.local`
- Ensure your API key is valid and has permissions
- Verify you haven't exceeded your quota limits

### Rate Limit (429) Errors
- Switch to a lighter model (Flash Lite)
- Wait for the retry delay before making another request
- Consider upgrading your Gemini API plan

### No answers returned
- Verify your quiz format matches the expected pattern
- Check the browser console for parsing errors
- Ensure questions include the text "Question" and "point"

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This application is for educational purposes. Please use responsibly and in accordance with academic integrity policies.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using Next.js and Google Gemini AI
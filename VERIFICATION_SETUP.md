# Answer Verification Setup Guide

## Current Features ✅

The system now includes:

1. **Fuzzy Matching** - Matches keywords even if exact text doesn't appear
2. **Multi-Source Verification** - Checks Wikipedia and web search
3. **Smart Scoring** - Weighted scoring system (Wikipedia 40%, Web 40%, Cross-check 20%)
4. **Detailed Logging** - Shows exactly why each confidence score was assigned
5. **Rate Limiting Protection** - 500ms delay between verifications

## Improvements Made

### 1. **Fuzzy Matching Algorithm**
- Extracts keywords from answers (words > 3 characters)
- Checks for partial matches (70% keyword match = high confidence)
- Compares answer mentions vs. other options

### 2. **Better Wikipedia Integration**
- Uses both search and summary APIs
- Extracts cleaner text summaries
- Better error handling

### 3. **Enhanced Web Search**
- Includes DuckDuckGo related topics
- Support for Google Custom Search (optional)
- Fallback mechanism if one source fails

### 4. **Confidence Scoring**
```
100% = Perfect match in all sources
75%  = Strong match in most sources
50%  = Moderate match (threshold for verification)
25%  = Weak match
0%   = No match found
```

## Optional: Setup Google Custom Search (Recommended)

Google Custom Search provides more reliable results than DuckDuckGo.

### Step 1: Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Custom Search API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### Step 2: Create Custom Search Engine
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create new search engine
3. Set "Sites to search" to "Search the entire web"
4. Create and copy your "Search Engine ID"

### Step 3: Add to Environment Variables
Add to your `.env.local` file:
```env
GOOGLE_SEARCH_API_KEY=your_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_engine_id_here
```

### Free Tier Limits
- Google Custom Search: 100 queries/day free
- Wikipedia: Unlimited (respects rate limits)
- DuckDuckGo: Unlimited (best effort)

## Testing Tips

### Test with Different Question Types

1. **Factual Questions** - Should have high confidence (60-100%)
   - "What is the capital of France?"
   - "Who invented the telephone?"

2. **Technical Questions** - Moderate confidence (40-70%)
   - Programming concepts
   - Scientific formulas

3. **Subjective/Opinion** - Low confidence (0-40%)
   - "What is the best programming language?"
   - Questions requiring context

### Interpreting Results

- **Confidence ≥ 75%** → High reliability, likely correct
- **Confidence 50-75%** → Moderate reliability, probably correct
- **Confidence 25-50%** → Low reliability, needs review
- **Confidence < 25%** → Very low reliability, manual review required

## Troubleshooting

### Low Confidence Scores

If you're getting consistently low scores:

1. **Check API responses** - Look at console logs for actual search results
2. **Question quality** - Vague questions get vague answers
3. **Answer format** - Long/complex answers harder to match
4. **Enable Google Search** - More reliable than DuckDuckGo

### No Results from Sources

- Wikipedia works best for general knowledge
- DuckDuckGo may return empty for niche topics
- Google Custom Search has better coverage

## Future Enhancements

Possible improvements:
- Add more sources (Stack Overflow API, academic databases)
- Machine learning for better answer matching
- Caching of verification results
- Domain-specific verification (math, code, etc.)

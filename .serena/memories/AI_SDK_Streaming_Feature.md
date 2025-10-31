# Vercel AI SDK Streaming + Multi-Provider Feature (Issue #43)

## Goal

Add streaming responses and multi-provider AI switching to AI Dictionary and AI Analyzer for better UX and free quota optimization.

## Current State

- AI Dictionary: Direct Google Gemini API calls, no streaming
- AI Analyzer: Direct Google Gemini API calls, no streaming
- No provider switching capability
- Using only free Gemini API

## Desired Changes

1. **Streaming Support**
   - Both AI Dictionary and AI Analyzer should display responses character-by-character
   - Better "AI feeling" for users
   - Uses Vercel AI SDK's streamText capability

2. **Multi-Provider Switching**
   - Support: Gemini, OpenAI, Anthropic Claude, Cohere, Hugging Face
   - UI settings for user to select provider
   - localStorage persistence
   - Rotate between providers to maximize free trial limits

3. **Technical Stack**
   - Vercel AI SDK (`ai` package)
   - Keep existing structure (API routes, Client Components)
   - Use `useChat` or `useCompletion` hooks from Vercel AI SDK
   - Streaming via Web Streams API

## Implementation Areas

- `lib/ai-providers.ts` - Provider factory pattern
- `lib/ai-client.ts` - Dynamic client initialization
- `/api/define` - AI Dictionary streaming endpoint
- `/api/ai-analyzer` - AI Analyzer streaming endpoint
- `packages/ai-dictionary/hooks/useWordAnalysis.ts` - Update to use Vercel AI SDK
- `packages/ai-analyzer/hooks/useAnalyze.ts` - Update to use Vercel AI SDK
- New Settings UI component for provider selection

## Current Issue #40 Completion

- ✅ Implemented React Query Server Component prefetching for blog page
- ✅ Blog page now Static (○) instead of Dynamic (λ)
- ✅ PR #42 created and ready for review

## Next Steps

1. Review and merge PR #42 (Issue #40)
2. Create separate branch for Vercel AI SDK streaming feature
3. Implement provider factory and configuration
4. Update API routes for streaming
5. Update frontend hooks to use Vercel AI SDK
6. Add Settings UI for provider selection
7. Test with all supported providers

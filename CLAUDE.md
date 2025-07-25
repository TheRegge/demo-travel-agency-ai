# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **portfolio-focused travel agency website** featuring an AI-powered travel planning assistant built with Google Gemini. The project showcases advanced development skills, production-level thinking, and AI integration capabilities.

**Key Concept**: User prompts AI through chatbot → AI returns structured JSON with trip recommendations → UI dynamically updates to show recommended trips outside the chat interface.

## Technology Stack & Commands

### Core Stack
- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19.1.0  
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **AI Integration**: Google Gemini 2.0 Flash via `@ai-sdk/google`

### Development Commands
```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Project Structure
```
├── docs/
│   ├── travel_agency_prd.md    # Complete project specification
│   └── tasks.json              # Project task tracking (check progress here)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── chat/              # Chat interface page
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── chat/              # Chat UI components
│   │   ├── illustrations/     # Tropical SVG animations
│   │   ├── layout/            # Page layout components
│   │   ├── trips/             # Trip display components (pending)
│   │   └── ui/                # Base UI components (shadcn pattern)
│   ├── contexts/
│   │   └── TravelContext.tsx  # Global state management
│   ├── lib/
│   │   ├── mock-data/         # Mock destinations & conversations
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── .claude/                   # Claude-specific configuration
```

## Architecture & Development Strategy

### Phase-Based Development Strategy
1. **Phase 1**: Static UI with mock interactions (Week 1)
2. **Phase 2**: AI integration and deployment (Week 2)

**Current Progress**: Tasks 1-5 complete, Task 6 (Mock AI Response System) in progress. Check `docs/tasks.json` for detailed status.

### AI-Driven Dynamic Content Flow
```
User Input (Chat) → Mock/AI Response → Structured JSON → TravelContext → UI Update
                                                          ↓
                                                    State Update
                                                          ↓
                                            [Chat History] + [Trip Cards Display]
```

**Critical**: The AI must return structured JSON responses matching the schema defined in the PRD (lines 367-395). This enables dynamic trip recommendations to appear outside the chat interface.

### State Management Architecture
- **TravelContext** (`src/contexts/TravelContext.tsx`): Central state management using React Context + useReducer
- **Key State Elements**:
  - `chatHistory`: Array of chat messages
  - `recommendedTrips`: Current AI recommendations (displayed as cards)
  - `savedTrips`: User's saved trip IDs
  - `activeFilters`: Search/filter state
  - `currentSessionTokens` & `dailySessions`: Rate limiting
- **Action Pattern**: All state updates go through typed reducer actions
- **Separation of Concerns**: Chat UI state is separate from trip recommendations state

## Design System & Visual Identity

### Theme: "Gentle Travel Paradise"
- **Style**: Modern flat illustrations with subtle animations
- **Color Palette**: Sky blues, warm sunset colors, nature greens, sand neutrals
- **Components**: Tropical background animations, clean chat interface

### Key Design Principles
- **Chat Interface**: Clean, conventional (function over form)
- **Background**: Playful tropical elements (palm trees, clouds, waves)
- **Mobile-First**: Responsive design across all devices

## AI Integration Specifics

### Gemini Configuration
- **Model**: Google Gemini 2.0 Flash
- **Response Format**: Must return valid JSON matching `AITripResponse` interface
- **Data Source**: 95% mock data, 5% real weather API
- **Rate Limiting**: 5 sessions/day per IP, $5/day spend cap

### Response Schema (Critical)
```typescript
interface AITripResponse {
  chatMessage: string;
  recommendations: {
    trips: TripRecommendation[];
    totalBudget: number;
  };
  followUpQuestions?: string[];
}
```

### Mock Data Strategy
- Trip recommendations must use `tripId` values from mock data
- AI responses populate UI components outside chat
- Weather API provides authenticity for specific destinations

### Mock Response System (Phase 1)
- **Keyword Detection**: `mockAIResponse` function analyzes user input for budget, destination, family keywords
- **Response Templates**: Pre-built responses for common scenarios (family trips, budget travel, etc.)
- **Mock Conversations**: Example conversations in `src/lib/mock-conversations.ts`
- **Fallback Database**: Ultra-budget, low-budget, and moderate budget trip options

## Component Architecture

### Component Organization
- **Client Components** (`"use client"`): Interactive components requiring browser APIs
- **Server Components**: Default for better performance (homepage sections)
- **Component Structure**:
  ```
  components/
  ├── chat/              # MessageBubble, MessageInput, TypingIndicator, LoadingSpinner
  ├── illustrations/     # FloatingClouds, PalmTrees, OceanWaves, ResponsiveTropicalBackground
  ├── layout/            # FeaturedDestinationsGrid, Header, Footer
  ├── trips/             # TripCard, TripRecommendations (pending implementation)
  └── ui/                # Button, Card, Input (shadcn/ui pattern)
  ```

### Key Architectural Patterns
- **Modular Imports**: Use path aliases (`@/components`, `@/lib`, `@/types`)
- **Type Safety**: All components have TypeScript interfaces for props
- **Animation Strategy**: Framer Motion for smooth transitions, CSS animations for background elements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Security & Production Considerations

### Rate Limiting
- Simple IP-based session tracking
- Token limits: 2,500 per conversation
- Fallback to mock responses when limits reached

### Essential Security
- Basic prompt injection protection
- Input validation (length limits, content sanitization)
- Environment variables for API keys

## Important Context

### Portfolio Goals
- **Maximum Impact**: High "wow" factor per development hour
- **Production Thinking**: Demonstrate real-world considerations
- **AI Expertise**: Show advanced LLM integration understanding

### Common Misunderstandings to Avoid
- This is NOT a booking platform - it's a demo/portfolio piece
- AI responses must update the main page content, not just chat
- No complex agent system needed - structured JSON responses suffice
- Focus on visual polish and AI integration over extensive features

## Development Workflow

### Task Management
- **Primary Task List**: `docs/tasks.json` tracks all project tasks
- **Current Phase**: Phase 1 (Static UI) - Tasks 1-5 complete, Task 6 in progress
- **Next Milestones**: 
  - Complete mock AI response system (Task 6)
  - Build dynamic trip display components (Task 7)
  - Connect state management (Task 8)

### Testing Strategy
- **Type Safety**: Run `npm run type-check` before commits
- **Linting**: Use `npm run lint` to maintain code quality
- **Manual Testing**: Test all mock conversations and UI interactions
- **Responsive Testing**: Verify mobile, tablet, and desktop layouts

Refer to `docs/travel_agency_prd.md` for complete technical specifications, user experience design details, and implementation examples.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "customs-siicumbres" - a complete housing customization system for Cumbres León. The system allows users to personalize homes through a step-by-step process with dynamic catalog management and administrative configuration.

### Business Objective
- **7-Step Customization Flow**: Model selection → Interior colors → Kitchen → Bathrooms → Closets → Extras → Summary
- **Dynamic Catalog Management**: Catalogs fed from configurable services with optional/required subcategories
- **Modern UX**: Auto-scroll, horizontal scroll, image zoom, real-time validation
- **Administrative Panel**: Dynamic configuration of optional vs required subcategories
- **Real-time Summary**: Side panel showing selections and progress

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite and HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

### TypeScript
- TypeScript compilation is handled by `tsc -b` before building
- Uses strict TypeScript configuration with modern ES2022 target
- Project uses bundler module resolution with verbatim module syntax

## Project Structure

### Entry Points
- `src/main.tsx` - Application entry point that renders the root React component
- `src/App.tsx` - Main application component
- `index.html` - HTML template with root div

### Configuration
- `vite.config.ts` - Vite configuration with React plugin
- `eslint.config.js` - ESLint configuration with React hooks and TypeScript rules
- `tsconfig.json` - Root TypeScript configuration that references app and node configs
- `tsconfig.app.json` - Application-specific TypeScript configuration with strict rules

### Build System
- Uses Vite as build tool and dev server
- ESLint configured with TypeScript, React hooks, and React refresh plugins
- TypeScript builds are cached in `node_modules/.tmp/`
- Production builds output to `dist/` directory (ignored by ESLint)

## Code Style and Conventions

### TypeScript Configuration
- Strict mode enabled with additional linting rules
- Unused locals and parameters are not allowed
- Uses React JSX transform (`"jsx": "react-jsx"`)
- Module detection is forced and uses ESNext modules

### ESLint Setup
- Extends recommended configurations for JavaScript, TypeScript, and React
- React hooks rules enforced
- React refresh plugin configured for Vite
- Targets ES2020 with browser globals

## Application Architecture

### Current Technology Stack
- **React 19.1.1** - Frontend framework
- **TypeScript 5.6.2** - Static typing
- **Vite 5.4.10** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first styling (Note: Downgraded from v4 due to lightningcss compatibility issues)
- **Framer Motion 11.11.17** - Animations and transitions
- **Context API + useReducer** - Global state management

### Key Implementation Details

#### State Management
- **CustomizationContext**: Global state using Context API + useReducer pattern
- **Actions**: SET_MODEL, SET_INTERIOR_COLOR, SET_KITCHEN_OPTION, etc.
- **State Structure**: Organized by customization categories (model, interiores, cocina, banos, closets, extras)

#### Dynamic Configuration System
- **SubcategoryConfigService**: Singleton service for managing optional/required subcategories
- **useSubcategoryConfig hook**: React hook for accessing configuration with caching
- **Dynamic subcategories**: climate, protection, energy, dome, window = optional; others = required

#### UX Features Implemented
- **Auto-scroll**: Automatic scroll to next section when completing a category
- **Horizontal scroll**: For sections with >6 options, automatic horizontal scroll with navigation arrows
- **Image zoom**: Modal lightbox for all option images with keyboard support
- **Responsive design**: Mobile-first approach with Tailwind CSS

#### Component Architecture
```
CustomizationLayout (main)
├── Header with admin config button
├── CustomizationStepper (progress navigation)
├── Dynamic page rendering based on current step
├── SummaryPanel (sidebar with real-time updates)
└── SubcategoryConfigManager (admin modal)
```

### Important Development Notes

#### CSS Framework Issue
- **Problem**: Tailwind CSS v4 alpha uses lightningcss with native dependencies that fail on Windows
- **Solution**: Downgraded to Tailwind CSS v3.4.17, working configuration in place
- **Files affected**: `package.json`, `tailwind.config.js`, `postcss.config.js`

#### TypeScript Configuration
- **verbatimModuleSyntax**: Enabled, requires `import type` for type-only imports
- **Strict mode**: All strict options enabled
- **Target**: ES2022 with bundler module resolution

#### Performance Optimizations
- **Singleton pattern**: SubcategoryConfigService for efficient configuration management
- **Smart scrolling**: useAutoScroll hook with debounced scroll behavior
- **Conditional rendering**: HorizontalOptionGrid switches between grid and scroll layouts

### File Organization

#### Core Components (`src/components/`)
- `CustomizationLayout.tsx` - Main layout and routing logic
- `OptionCard.tsx` - Reusable option display with zoom functionality
- `HorizontalOptionGrid.tsx` - Smart grid that adapts to option count
- `ImageModal.tsx` - Lightbox modal for image viewing
- `SubcategoryConfigManager.tsx` - Administrative configuration panel

#### Pages (`src/components/`)
- `ModelSelectionPage.tsx` - House model selection
- `InteriorColorsPage.tsx` - Interior color customization (6 rooms)
- `KitchenPage.tsx` - Kitchen customization (7 elements)
- `BathroomPage.tsx` - Bathroom customization (5 elements)
- `ClosetsPage.tsx` - Closet customization (5 elements)
- `ExtrasPage.tsx` - Extras and accessories (7+ sections)
- `SummaryPage.tsx` - Final review and confirmation

#### Hooks (`src/hooks/`)
- `useAutoScroll.ts` - Scroll behavior management
- `useSubcategoryConfig.ts` - Dynamic configuration management

#### Services (`src/services/`)
- `subcategoryConfigService.ts` - Configuration service with mock API

### Data Structure

#### Mock Data (`src/data/mockData.ts`)
- 6 house models with floor plans
- 12 interior colors (shared across rooms)
- 13 wood finishes (shared across kitchen/bathroom/closets)
- Kitchen options: countertops, backsplash, sinks
- Bathroom options: glass finishes
- Extras: facade colors, minisplit, protections, solar panels, patio options, reflective windows

#### Type Definitions (`src/types/index.ts`)
- `CustomizationOption` - Base option interface
- `HouseModel` - House model with floor plans
- `CustomizationState` - Complete application state
- `SubcategoryConfig` - Dynamic configuration structure
- `CustomizationCatalog` - Full catalog structure

### Development Workflow

#### When Adding New Features
1. **Update types first** in `src/types/index.ts`
2. **Add to mock data** in `src/data/mockData.ts`
3. **Update context** actions and reducer if needed
4. **Create/modify components** following existing patterns
5. **Test UX flows** especially auto-scroll and validation

#### When Modifying Subcategories
1. **Use SubcategoryConfigManager** accessible via ⚙️ button in header
2. **Update configuration** in `subcategoryConfigService.ts`
3. **Test optional/required** behavior across all pages

#### Common Patterns
- **Option selection**: Always use OptionCard component
- **Section layout**: Use HorizontalOptionGrid for consistent behavior
- **State updates**: Use context actions, never direct state mutation
- **Navigation**: Use scrollToTop() before page transitions
- **Error handling**: Images have automatic fallbacks to placeholders

### Testing and Debugging

#### Key Testing Areas
- **Responsive design**: Test grid vs horizontal scroll at different screen sizes
- **Auto-scroll behavior**: Verify smooth transitions between sections
- **Image loading**: Test with missing/broken image URLs
- **Configuration changes**: Test optional/required subcategory behavior
- **State persistence**: Verify selections persist across page navigation

#### Debug Tools
- **React DevTools**: Inspect CustomizationContext state
- **Configuration panel**: Use ⚙️ button to view/refresh subcategory config
- **Console logging**: Services include strategic logging for debugging
- **Network simulation**: SubcategoryConfigService includes simulated delays

### Future Development Notes

#### Ready for Backend Integration
- **API endpoints planned**: See TECHNICAL_GUIDE.md for expected API structure
- **Service layer ready**: SubcategoryConfigService can easily connect to real API
- **Environment variables**: Configured for VITE_API_URL and related endpoints

#### Performance Considerations
- **Image optimization**: Consider lazy loading for large catalogs
- **Bundle optimization**: Already configured with manual chunks in Vite
- **State optimization**: Consider React.memo for heavy re-renders if needed

### Documentation References
- **HISTORY.md** - Complete development timeline and decisions
- **README.md** - User guide and installation instructions
- **TECHNICAL_GUIDE.md** - Deep technical architecture documentation

For any questions about implementation details, refer to the technical guide or examine the existing component patterns.
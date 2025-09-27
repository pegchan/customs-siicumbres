# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "customs-siicumbres" - a housing customization system that displays personalization options for homes. The application will be fed by catalogs containing various customization options that users can browse and select to personalize their housing.

### Business Objective
- Display housing customization options sourced from catalogs
- Allow users to browse and explore personalization choices
- Manage catalog data for different customization categories
- Provide interface for selecting and previewing home personalizations

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
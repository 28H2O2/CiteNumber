# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-page web application for querying academic paper citation counts. It's built with vanilla HTML, CSS, and JavaScript without any build process or dependencies.

## Architecture

The application consists of three static files:
- `index.html` - Main HTML structure with search interface and result display sections
- `styles.css` - Responsive styling with gradient backgrounds and card-based layouts
- `script.js` - Core functionality for searching papers via Semantic Scholar API

## Key Implementation Details

### API Integration
The app uses the Semantic Scholar API (`api.semanticscholar.org/graph/v1/paper/search`) which:
- Requires no authentication/API key
- Returns paper metadata including citation counts
- Limits results to 10 papers per search

### Main Functions
- `searchPapers()` - Handles API calls and manages UI states (loading/error/results)
- `createPaperCard()` - Generates HTML cards for each paper with escaped content
- `escapeHtml()` - Prevents XSS attacks in displayed paper data

## Development

To run locally:
```bash
open index.html
```

No build process, package management, or local server required - just open the HTML file in a browser.

## Testing Queries

Example searches for testing functionality:
- "Attention Is All You Need"
- "BERT"
- "ResNet"
- "GPT-3"
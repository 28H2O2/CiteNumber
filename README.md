# CiteNumber - Academic Paper Citation Query Tool

A lightweight, bilingual (Chinese/English) web application for querying academic paper citation counts using the Semantic Scholar API.

## Features

- 🌏 **Bilingual Support**: Switch between Chinese and English
- 🔍 **Single & Batch Search**: Query one or multiple papers at once
- 📝 **Search History**: Track recent searches with local storage
- 🚀 **Zero Dependencies**: Pure HTML/CSS/JavaScript
- 📱 **Responsive Design**: Works on all devices

## Deployment Options

### 1. GitHub Pages (Recommended)
```bash
# Push to GitHub repository
git add .
git commit -m "Deploy citation query tool"
git push origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: Deploy from branch (main)
```

### 2. Vercel
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo at vercel.com
```

### 3. Netlify
- Drag and drop folder to netlify.com
- Or connect GitHub repository

### 4. Static Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using Nginx/Apache
# Copy files to web root directory
```

### 5. University/School Server
```bash
# Copy files to server
scp -r ./* user@server:/var/www/html/cite-tool/

# Set permissions
chmod -R 755 /var/www/html/cite-tool/
```

## Usage

1. Open `index.html` in a browser
2. Toggle language with top-right buttons
3. Search papers by title or keywords
4. View citation counts and paper details

## API

Uses Semantic Scholar API (no authentication required):
- Endpoint: `api.semanticscholar.org/graph/v1/paper/search`
- Rate limits apply for high-volume usage

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## License

MIT
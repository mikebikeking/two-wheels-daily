# Backend API Setup

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Express.js (backend server)
- CORS (cross-origin support)
- tsx (TypeScript execution)
- concurrently (run client & server together)

### 2. Run Development Server

```bash
npm run dev
```

This starts both:
- **Frontend**: Vite dev server on `http://localhost:5173`
- **Backend**: Express API on `http://localhost:3001`

The frontend automatically proxies `/api/*` requests to the backend.

### 3. Test the API

Visit: `http://localhost:3001/api/feeds`

You should see JSON with aggregated cycling news feeds!

## 📁 Project Structure

```
server/
├── index.ts              # Express server entry point
├── tsconfig.json         # TypeScript config for server
├── lib/
│   ├── feedAggregator.ts # RSS parsing & aggregation
│   ├── feedCache.ts      # In-memory caching (1 hour)
│   └── feedConfig.ts     # Feed source configuration
└── types/
    └── feed.ts           # TypeScript interfaces
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run both frontend & backend |
| `npm run dev:client` | Run only frontend (Vite) |
| `npm run dev:server` | Run only backend (Express) |
| `npm run build` | Build both frontend & backend |
| `npm run build:server` | Build only backend |
| `npm run build:client` | Build only frontend |
| `npm start` | Run production server |

## 🌐 API Endpoints

### `GET /api/feeds`

Returns aggregated RSS feeds from all configured sources.

**Response:**
```json
{
  "stories": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "link": "...",
      "pubDate": "2024-01-01T00:00:00.000Z",
      "source": {
        "name": "Cycling News",
        "url": "...",
        "color": "bg-blue-100 text-blue-800"
      },
      "image": "..."
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "totalStories": 50
}
```

**Caching:**
- Results are cached for 1 hour
- Cache-Control header: `public, max-age=3600`

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 CORS

The backend has CORS enabled, allowing requests from:
- `http://localhost:5173` (Vite dev server)
- Any origin (configured for development)

For production, restrict CORS to your domain.

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

This creates:
- `dist/` - Frontend build
- `server/dist/` - Backend build

### Run Production Server

```bash
npm start
```

The server will run on port 3001 (or PORT environment variable).

### Environment Variables

- `PORT` - Server port (default: 3001)

### Deployment Options

1. **Vercel/Netlify** - Deploy frontend, use serverless functions for API
2. **Railway/Render** - Deploy full-stack app
3. **VPS** - Run Node.js server directly
4. **Docker** - Containerize the application

## 🐛 Troubleshooting

### Port Already in Use

If port 3001 is taken:
```bash
PORT=3002 npm run dev:server
```

### CORS Errors

Make sure the backend is running and Vite proxy is configured correctly in `vite.config.ts`.

### Feed Fetching Fails

- Check server logs for errors
- Verify feed URLs in `server/lib/feedConfig.ts`
- Some feeds may be temporarily unavailable

## 📝 Notes

- Backend uses in-memory caching (resets on server restart)
- For production, consider Redis for persistent caching
- Feed aggregation happens server-side (no CORS issues!)
- All dates are serialized as ISO strings in JSON responses

---

**The backend API solves all CORS issues!** 🎉

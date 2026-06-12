# Deployment Guide

This project is arranged for a split deployment:

- Frontend: Vercel, Netlify, or any static hosting service
- Backend: Render, Railway, Fly.io, or any Node.js hosting service
- Database: MongoDB Atlas

## Backend

Recommended service settings:

```text
Root directory: backend
Build command: npm install
Start command: npm start
Health check path: /api/health
```

Environment variables:

```env
PORT=5000
ATLASDB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=https://your-frontend-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain.vercel.app
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

After deploying the backend, test:

```text
https://your-backend-domain/api/health
```

## Frontend

Recommended service settings:

```text
Root directory: frontend
Build command: npm install && npm run build
Output directory: dist
```

Environment variables:

```env
VITE_API_URL=https://your-backend-domain/api
VITE_SOCKET_URL=https://your-backend-domain
VITE_AI_ORDER_ENDPOINT=
VITE_ENABLE_DEMO_MODE=true
```

The `frontend/vercel.json` file is included so direct links like `/login`,
`/admin`, `/menu`, and `/service/orders` work after refresh on Vercel.

## Notes

- Do not commit real `.env` files.
- Use MongoDB Atlas for production instead of local MongoDB.
- File uploads are stored on the backend filesystem. On platforms with ephemeral
  disks, uploaded images may reset after redeploys. For permanent uploads, move
  images to Cloudinary, S3, or another object storage provider.

# Deployment Guide

This project is configured as one Render web service with MongoDB Atlas. The
Express backend serves the built React frontend from `client/dist`, so the
frontend and API stay on the same Render domain.

## Single App Deployment

Render service settings:

```text
Root directory: .
Build command: npm run build
Start command: npm start
Health check path: /api/health
```

Environment variables:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=production
```

Render provides `PORT` and `RENDER_EXTERNAL_URL` automatically. The production
frontend defaults to the Render API URL configured in `client/src/services/api.js`.

After deploying the backend, test:

```text
https://restaurant-and-hotel-management-website.onrender.com/api/health
```

Optional frontend build variables:

```env
VITE_API_URL=https://restaurant-and-hotel-management-website.onrender.com/api
VITE_SOCKET_URL=https://restaurant-and-hotel-management-website.onrender.com
VITE_AI_ORDER_ENDPOINT=
VITE_ENABLE_DEMO_MODE=true
```

## Notes

- Do not commit real `.env` files.
- Use MongoDB Atlas for production instead of local MongoDB.
- File uploads are stored on the backend filesystem. On platforms with ephemeral
  disks, uploaded images may reset after redeploys. For permanent uploads, move
  images to Cloudinary, S3, or another object storage provider.


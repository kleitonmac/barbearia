Correções aplicadas automaticamente:
- Backend: ensured process.env.PORT || 3000, added CORS with origin '*', added dotenv.config() if found.
- Frontend: replaced fetch('http://localhost:PORT/route') with fetch(`${import.meta.env.VITE_API_URL}/route`)
- Added example .env files for backend and frontend (if not present).

Deploy notes:
- Set VITE_API_URL in frontend environment variables on Vercel to your backend URL (https://<your-backend>.vercel.app)
- Set MONGO_URI and PORT in backend environment variables on Vercel.

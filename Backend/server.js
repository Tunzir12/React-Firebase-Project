import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js'; // Use '.js' extension for local files

// Load environment variables
dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 5000; 

// Global Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000' 
}));
app.use(express.json());

// API Routes
app.use('/api', router); 

app.get('/', (req, res) => {
    res.send('Kanban Board Backend API is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
import express from 'express';
import router from './routes/routes.mjs';

const app = express();
const port = 8080 || process.env.PORT;

app.set('trust proxy', '127.0.0.1');
app.use(express.static('client'));

// Add the API route
app.use('/api/', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

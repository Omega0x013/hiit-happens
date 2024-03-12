import express from 'express';
import workout from './routes/workout.mjs';

const app = express();
const port = 8080 || process.env.PORT;

// Add the API route
app.use('/api/workout/', workout);

app.use(express.static('client'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

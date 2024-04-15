import express from 'express';

const app = express();
const port = 8080 || process.env.PORT;

app.use(express.static('client'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

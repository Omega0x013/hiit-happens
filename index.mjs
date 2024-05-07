import express from 'express';

const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.static('client'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

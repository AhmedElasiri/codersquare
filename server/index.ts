import express, { ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import { createPostHandler, listPostsHandler } from './handlers/postHandler';
import asyncHandler from 'express-async-handler';

const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.get('/v1/posts', asyncHandler(listPostsHandler));
app.post('/v1/posts', asyncHandler(createPostHandler));

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log('Uncaught exeception: ', err);
  return res.status(500).send('Oops, an unexpected error occurred, please try again');
};

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server runing on port 3000');
});

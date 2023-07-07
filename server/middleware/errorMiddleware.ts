import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log('Uncaught exeception: ', err);
  return res.status(500).send('Oops, an unexpected error occurred, please try again');
};

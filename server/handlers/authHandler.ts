import crypto from 'crypto';

import { SingInRequest, SingInResponse, SingUpRequest, SingUpResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, User } from '../types';

export const singUpHandler: ExpressHandler<SingUpRequest, SingUpResponse> = async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400);
  }

  const existing = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));
  if (existing) {
    return res.status(403).send('User already exists');
  }
  const user: User = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    password,
    username,
  };
  await db.createUser(user);
  return res.sendStatus(200);
};

export const singInHandler: ExpressHandler<SingInRequest, SingInResponse> = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400);
  }
  console.log(login);
  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== password) {
    return res.sendStatus(403);
  }

  return res.status(200).send({
    email: existing.email,
    firstName: existing.firstName,
    lastName: existing.lastName,
    username: existing.username,
    id: existing.id,
  });
};

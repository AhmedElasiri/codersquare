import crypto from 'crypto';

import { SingInRequest, SingInResponse, SingUpRequest, SingUpResponse } from '../api';
import { signJwt } from '../auth';
import { db } from '../datastore';
import { ExpressHandler, User } from '../types';

export const singUpHandler: ExpressHandler<SingUpRequest, SingUpResponse> = async (req, res) => {
  const { email, firstName, lastName, password, username } = req.body;
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400);
  }

  const existing = (await db.getUserByEmail(email)) || (await db.getUserByUsername(username));
  if (existing) {
    return res.status(403).send({ error: 'User already exists' });
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
  const jwt = signJwt({ userId: user.id });
  return res.status(200).send({ jwt });
};

export const singInHandler: ExpressHandler<SingInRequest, SingInResponse> = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  console.log(login);
  const existing = (await db.getUserByEmail(login)) || (await db.getUserByUsername(login));
  if (!existing || existing.password !== password) {
    return res.status(403).send({ error: 'User already exists' });
  }
  const jwt = signJwt({ userId: existing.id });

  return res.status(200).send({
    user: {
      email: existing.email,
      firstName: existing.firstName,
      lastName: existing.lastName,
      username: existing.username,
      id: existing.id,
    },
    jwt,
  });
};

import crypto from 'crypto';

import { SingInRequest, SingInResponse, SingUpRequest, SingUpResponse } from '../api';
import { signJwt } from '../auth';
import { Datastore } from '../datastore';
import { ExpressHandler, User } from '../types';

export class UserHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public singUpHandler: ExpressHandler<SingUpRequest, SingUpResponse> = async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400);
    }

    const existing =
      (await this.db.getUserByEmail(email)) || (await this.db.getUserByUsername(username));
    if (existing) {
      return res.status(409).send({ error: 'User already exists' });
    }

    const user: User = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      username,
      password: this.hashPassword(password),
      createdAt: Date.now(),
    };
    await this.db.createUser(user);
    const jwt = signJwt({ userId: user.id });
    return res.status(200).send({ jwt });
  };

  public singInHandler: ExpressHandler<SingInRequest, SingInResponse> = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    const existing =
      (await this.db.getUserByEmail(login)) || (await this.db.getUserByUsername(login));
    if (!existing || existing.password !== this.hashPassword(password)) {
      return res.status(403).send({
        error: 'Invalid email or password. Please try again.',
      });
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

  hashPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.PASSWORD_SALT!, 42, 32, 'sha512')
      .toString('hex');
  }
}

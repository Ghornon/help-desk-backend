import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import bcrypt from 'bcryptjs';

import { JWT_SECRET } from './auth';
import UserModel from '../models/userModel';

const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const LocalStrategy = passportLocal.Strategy;

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader('authorization'),
			secretOrKey: JWT_SECRET,
		},
		async (payload, done) => {
			try {
				const user = await UserModel.findById(payload.sub).exec();

				if (!user) {
					return done(null, false);
				}

				return done(null, user);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

passport.use(
	new LocalStrategy(
		{
			usernameField: 'username',
			passwordField: 'password',
		},
		async (username, password, done) => {
			try {
				const user = await UserModel.findOne({ username }).select('password').exec();

				if (!user) {
					return done(null, false);
				}

				const hash = user.password;
				const isValidate = await bcrypt.compare(password, hash);

				if (!isValidate) {
					return done(null, false);
				}

				return done(null, user);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

export default passport;

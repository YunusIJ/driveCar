import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ facebookId: profile.id });

        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          facebookId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails?.[0]?.value || '',
          profilePicture: profile.photos?.[0]?.value || '',
          role: 'USER',
        });

        done(null, newUser);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

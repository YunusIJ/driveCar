import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
  console.error('❌ Missing Facebook credentials in environment variables');
  process.exit(1);
}

const CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL;

const retryOperation = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: CALLBACK_URL,
    profileFields: ['id', 'emails', 'name'],
    proxy: true,
    timeout: 20000,
    state: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      await retryOperation(async () => {
        let user = await User.findOne({ facebookId: profile.id });
        
        if (!user && profile.emails && profile.emails.length > 0) {
          user = await User.create({
            facebookId: profile.id,
            email: profile.emails[0].value,
            userName: profile.displayName || profile.emails[0].value.split('@')[0],
            role: 'USER'
          });
        }

        if (!user) {
          return done(new Error('Failed to create user'));
        }

        return done(null, user);
      });
    } catch (error) {
      console.error('Facebook strategy error:', error);
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

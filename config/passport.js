const passport      = require('passport');
const bcrypt        = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserModel     = require('../models/user-model');

  passport.serializeUser((userFromDB, cb) => {
    cb(null, userFromDB._id);
  });

  passport.deserializeUser((userIdFromSession, next) => {
    UserModel.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        next(err);
        return;
      }

      cb(null, userDocument);
    }
    );
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'loginEmail',
      passwordField: 'loginPassword'
    },
    (apiEmail, apiPassword, next) => {
      UserModel.findOne(
        { email: apiEmail }, (err, foundUser) => {
          if (err) {
            next(err);
            return;
        }

        if (!userFromDB) {
          next(null, false, { message: 'Invalid email fool' });
          return;
        }

        if (!bcrypt.compareSync(apiPassword, userFromDB.encryptedPassword)) {
          next(null, false, { message: 'Incorrect password fool' });
          return;
        }

        next(null, userFromDB);
      }
    );
  }
));


}


module.exports =

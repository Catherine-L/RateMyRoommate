var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bCrypt = require('bcrypt')
const users = require('../data/users')

// Passport needs to be able to serialize and deserialize users to support persistent login sessions
passport.serializeUser(function (user, done) {
  console.log('serializing user:', user)
  // return the unique id for the user
  done(null, user)
})

// Deserialize user will call with the unique id provided by serialize user
passport.deserializeUser(function (user, done) {
  return done(null, user)
})

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
},
  function (req, email, password, done) {
    //console.log(`Searching for ${email} with ${password}`);
    //console.log('Hash of "password" is ' + createHash("password"));
    users.getUserByEmail(email).then((_data) => {
      //console.log(_data);
      if (_data) {
        if (!isValidPassword(password, _data.password)) {
          //console.log(`Invalid Password ${password}. Login failed.`)
          return done(null, false, req.flash('message', 'Invalid Password'))
        }
        //console.log("Successfully logged in!")
        return done(null,
        {
          //maybe name? see if necessary later
          userID: _data._id,
          email: _data.email
        })
      } else {
          //console.log(`Invalid Email ${email}. Login failed.`)
          return done(null, false, req.flash('message', 'Account does not exist'))
      }
    })
      .catch((err) => {
        //console.log("No user with this email")
        return done(err)
      })
  })
)

//don't forget to check if email is unique when you do sign up
var isValidPassword = function (pRaw, pHashed) {
  return bCrypt.compareSync(pRaw, pHashed)
}

// Generates hash using bCrypt
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

module.exports = passport

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bCrypt = require('bcrypt')
const users = require('./data/users')

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
  passReqToCallback: true
},
  function (req, username, password, done) {
    users.findUserByUsername(username).then((_data) => {
      console.log(_data)
      if (_data) {
        if (!isValidPassword(password, _data.password)) {
          return done(null, false, req.flash('message', 'Invalid Password'))
        }
        return done(null,
        {
          username: username,
          userID: _data.userID,
          email: _data.userEmail,
        })
      } else {
          return done(null, false, req.flash('message', 'Account does not exist'))
      }
    })
      .catch((err) => {
        return done(err)
      })
  })
)

var isValidPassword = function (pRaw, pHashed) {
  return bCrypt.compareSync(pRaw, pHashed)
}

// Generates hash using bCrypt
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

module.exports = passport
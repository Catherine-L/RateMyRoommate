const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const comments = require('../data/comments.js')

router.get('/', (req, res) => {
  if(req.user) {
    if(req.user.isAdmin) {
      comments.getAllSpamComments().then((comments) => {
        //console.log(comments)
         res.render('manage',
          {
            loggedIn: req.user,
            isAdmin: req.user.isAdmin,
            comments: comments
          })
      })
    }
  } else {
    res.render('manage')
  }
});

router.post('/delete/:id', (req, res) => {
  //console.log(req.params.id)
  comments.removeComment(req.params.id).then((_data) => {
    res.json({success: true})
  })
})

router.post('/unflag/:id', (req, res) => {
  //console.log(req.params.id)
  comments.removeSpamFlagFromComment(req.params.id).then((_data) => {
    //console.log(_data)
    res.json({success: true})
  })
})
module.exports = router;
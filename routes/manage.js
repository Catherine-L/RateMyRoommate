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
  comments.removeComment(req.params.id).then((_data) => {
    res.redirect('/manage')
  })
})

module.exports = router;
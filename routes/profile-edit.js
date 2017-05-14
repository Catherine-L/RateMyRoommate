const express = require('express');
const router = express.Router();
const userData = require("../data/users");

router.get('/:id', (req, res) =>{
    if (req.user) //not logged in
    {
        if(req.user.userID === req.params.id) {
            userData.getUserById(req.params.id).then((user) => {
                res.render('profile-edit', {user: user, loggedIn: req.user});
            }).catch(() => {
                res.status(404).json({ error: "User not found" });
            });
        }
    }
    else {
        res.render('profile-edit')
    }
});

router.post('/:id', (req, res) =>{
    let newProfileInfo = req.body; 
    console.log(req.body);
    userData.updateUserProfile(req.params.id, newProfileInfo.firstName, newProfileInfo.lastName, newProfileInfo.email,newProfileInfo.city, newProfileInfo.state, newProfileInfo.country, newProfileInfo.bio).then((updatedUserData) =>{
            res.redirect(`/users/${updatedUserData._id}`);
        }).catch((e) =>{
           res.status(500).json({ error: e }); 
        });
});

module.exports = router;
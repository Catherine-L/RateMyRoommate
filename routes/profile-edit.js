const express = require('express');
const router = express.Router();
const userData = require("../data/users");

router.get('/:id', (req, res) =>{
    if (!req.user) //not logged in
        res.status(400).json({ error: "You must be logged in to edit your profile." });
    else{
        userData.getUserById(req.params.id).then((user) => {
            res.render('profile-edit', {user: user});
        }).catch(() => {
            res.status(404).json({ error: "User not found" });
        });
    }
});

router.post('/:id', (req, res) =>{
    let newProfileInfo = req.body; 
    console.log(req.body);
    userData.updateUserProfile(req.params.id, newProfileInfo.email, newProfileInfo.city, newProfileInfo.state, newProfileInfo.country).then((updatedUserData) =>{
            res.redirect(`/users/${req.params.id}`);
        }).catch((e) =>{
           res.status(500).json({ error: e }); 
        });
});

module.exports = router;
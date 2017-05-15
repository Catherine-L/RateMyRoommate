const express = require('express');
const router = express.Router();
const userData = require("../data/users");

router.get('/:id', (req, res) =>{
    if (req.user) // logged in
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
    let errors = [];
    
    if (!newProfileInfo.firstName && !newProfileInfo.lastName && !newProfileInfo.email && !newProfileInfo.city && 
    !newProfileInfo.state && !newProfileInfo.country && !newProfileInfo.bio){
        res.json({ errors: "Need at least one field to update profile", success:false });
        errors.push("Need at least one field to update profile");
        return;
    } else if (newProfileInfo.email){
        userData.getUserByEmail(newProfileInfo.email).then((_data)=>{
            if (_data){
                res.json({ errors: "Email already exists" , success:false });
                errors.push("Email already exists");
                return;
            } else {
                userData.updateUserProfile(req.params.id, newProfileInfo.firstName, newProfileInfo.lastName, newProfileInfo.email,newProfileInfo.city, newProfileInfo.state, newProfileInfo.country, newProfileInfo.bio).then((updatedUserData) =>{
                    res.json({errors: errors, success: true})
                }).catch((e) =>{
                    res.status(500).json({ errors: e, success:false }); 
                });
            }
        });
    } else{
        userData.updateUserProfile(req.params.id, newProfileInfo.firstName, newProfileInfo.lastName, newProfileInfo.email,newProfileInfo.city, newProfileInfo.state, newProfileInfo.country, newProfileInfo.bio).then((updatedUserData) =>{
           res.json({errors: errors, success: true})
        }).catch((e) =>{
           res.status(500).json({ errors: e, success:false }); 
        });
    }
});

module.exports = router;

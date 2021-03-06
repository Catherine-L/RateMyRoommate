// copied from lecture 8 code route/users.js

const express = require('express');
const router = express.Router();
const userData = require("../data/users");
const commentData = require("../data/comments");

router.get("/:id", (req, res) => {
    userData.getUserById(req.params.id).then((user) => {
        if(req.user)
        {
            if(req.user.userID === req.params.id)
            {
                commentData.getCommentsByUser(req.params.id).then((comments) => {
                    res.render('user', {myprofile:req.user, user: user, comments: comments, loggedIn: req.user});
                    //res.json(comments);
                    }).catch(() => {
                        //console.log("getting user comments failed");
                        res.render('user', {user: user, comments: [], loggedIn: req.user});
                    })
            }
            else {
                commentData.getCommentsByUser(req.params.id).then((comments) => {
                    res.render('user', {user: user, comments: comments, loggedIn: req.user});
                    //res.json(comments);
                }).catch(() => {
                    //console.log("getting user comments failed");
                    res.render('user', {user: user, comments: [], loggedIn: req.user});
                })
            }
        }
        else {
            commentData.getCommentsByUser(req.params.id).then((comments) => {
                res.render('user', {user: user, comments: comments});
                //res.json(comments);
            }).catch(() => {
                //console.log("getting user comments failed");
                res.render('user', {user: user, comments: []});
            })
        } 
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

router.post("/:id/comment", (req, res) => {
    //console.log("Adding comment");
    let errors = []
    if(!req.user)
        errors.push("You're not logged in. Hacker.");
    if(!req.body.comment)
        errors.push("You gotta write a comment buddy.");
    if(!req.params.id)
        errors.push("Not commenting on any user. Somehow.");

    if (errors.length > 0) {
        res.json({errors: errors, success:false});
        return;
    }
    commentData.addComment(req.user.userID,req.params.id,req.body.comment)
        .then((newComment) => {
            res.json({success: true, errors: []});
        }).catch((e) => {
            res.json({errors: ["Error adding comment, server error"], success: false});
        });
    //console.log(req.user);
    //console.log(req.body);
});

router.post("/", (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to create a user" });
        return;
    }

    if (!userInfo.firstName) {
        res.status(400).json({ error: "You must provide a first name" });
        return;
    }

    if (!userInfo.lastName) {
        res.status(400).json({ error: "You must provide a last name" });
        return;
    }

    if (!userInfo.email) {
        res.status(400).json({ error: "You must provide an email" });
        return;
    }

    if (!userInfo.password) {
        res.status(400).json({ error: "You must provide a password" });
        return;
    }
    
    userData.addUser(userInfo.firstName, userInfo.lastName, userInfo.email, userInfo.password)
        .then((newUser) => {
            res.json(newUser);
        }, () => {
            res.sendStatus(500);
        });
});

router.delete("/:id", (req, res) => {
    let user = userData.getUserById(req.params.id).then(() => {
        return userData.removeUser(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch(() => {
                res.sendStatus(500);
            });

    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

router.post("/:userId/comments/:commentId/flag", (req, res) =>
{
    let flagInfo = req.body;
    commentData.addSpamFlagToComment(req.params.commentId, req.user.userID, req.body.reason).then((updatedCommentData) =>
    {
        res.json({success: true, errors: []});
    }).catch((e) =>
    {
        res.status(500).json({ success: false, errors: e }); 
    });
});

module.exports = router;

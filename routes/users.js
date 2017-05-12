// copied from lecture 8 code route/users.js

const express = require('express');
const router = express.Router();
const userData = require("../data/users");
const commentData = require("../data/comments");

router.get("/:id", (req, res) => {
    userData.getUserById(req.params.id).then((user) => {
        commentData.getCommentsByUser(req.params.id).then((comments) => {
            //console.log("getting user " + comments);
            res.render('user', {user: user, comments: comments, loggedIn: req.user});
        }).catch(() => {
            //console.log("getting user comments failed");
            res.render('user', {user: user, comments: [], loggedIn: req.user});
        });
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
    });
});

router.get("/", (req, res) => {
    userData.getAllUsers().then((userList) => {
        res.json(userList);
    }, () => {
        // Something went wrong with the server!
        res.sendStatus(500);
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

router.put("/:id", (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
        res.status(400).json({ error: "You must provide data to update a user" });
        return;
    }
    /*
    if (!userInfo.firstName) {
        res.status(400).json({ error: "You must provide a first name" });
        return;
    }

    if (!userInfo.lastName) {
        res.status(400).json({ error: "You must provide a last name" });
        return;
    }
    */

    let getUser = userData.getUser(req.params.id).then(() => {
        return userData.updateUser(req.params.id, userInfo)
            .then((updatedUser) => {
                res.json(updatedUser);
            }, () => {
                res.sendStatus(500);
            });
    }).catch(() => {
        res.status(404).json({ error: "User not found" });
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

module.exports = router;

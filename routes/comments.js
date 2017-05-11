// copied from lecture 8 code route/posts.js

const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;

router.get("/new", (req, res) => {
    res.render('comments/new');
})

router.get("/:id", (req, res) => {
    postData.getCommentById(req.params.id).then((comment) => {
        res.render('comments/single', { comment: comment });
    }).catch(() => {
        res.status(404).json({ error: "Comment not found" });
    });
});

/*router.get("/tag/:tag", (req, res) => {
    postData.getPostsByTag(req.params.tag).then((postList) => {
        res.render('posts/index', { posts: postList });
    });
});*/

router.get("/", (req, res) => {
    postData.getAllComments().then((commentList) => {
        res.render('comments/index', { comments: commentList });
    }).catch((e) => {
        res.status(500).json({ error: e });
    });
});

router.post("/", (req, res) => {
    let commentPostedData = req.body;
    let errors = [];

    if (!commentPostedData.userWhoCommented_id) {
        errors.push("No userWhoCommented_id provided");
    }

    if (!commentPostedData.userWhoCommentIsFor_id) {
        errors.push("No userWhoCommentIsFor_id provided");
    }
    
    if (!commentPostedData.comment) {
        errors.push("No comment content provided");
    }

    if (errors.length > 0) {
        res.render('comments/new', { errors: errors, hasErrors: true, comment: commentPostedData});
        return;
    }

    postData.addComment(commentPostedData.userWhoCommented_id, commentPostedData.userWhoCommentIsFor_id, 
    commentPostedData.userFlagged_id || null, commentPostedData.flagReason || null)
        .then((newComment) => {
            res.redirect(`/comments/${newComment._id}`);
        }).catch((e) => {
            res.status(500).json({ error: e });
        });
});

router.put("/:id", (req, res) => {
    let updatedData = req.body;

    let getComment = commentData.getCommentById(req.params.id);

    getComment.then(() => {
        return commentData.updateComment(req.params.id, updatedData)
            .then((updatedComment) => {
                res.json(updatedComment);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Post not found" });
    });

});

router.delete("/:id", (req, res) => {
    let getComment = commentData.getCommentById(req.params.id);

    getComment.then(() => {
        return commentData.removeComment(req.params.id)
            .then(() => {
                res.sendStatus(200);
            }).catch((e) => {
                res.status(500).json({ error: e });
            });
    }).catch(() => {
        res.status(404).json({ error: "Post not found" });
    });
});

module.exports = router;
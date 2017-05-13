// copied from lecture 8 code data/posts.js

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllComments() {
        return comments().then((commentCollection) => {
            return commentCollection.find({}).toArray();
        })
    },
    getCommentById(id) {
        return comments().then((commentCollection) => {
            return commentCollection.findOne({ _id: id }).then((comment) => {
                if (!comment) throw "comment not found";
                return comment;
            });
        });
    },
    getCommentsByUser(userId) {
        return comments().then((commentCollection) => {
            return commentCollection.find({userWhoCommentIsFor_id: userId.toString() }).toArray();
        });
    },
    addComment(userWhoCommented_id, userWhoCommentIsFor_id, comment) {
        return comments().then((commentCollection) => {
            let newComment = {
                _id: uuid.v4(),
                userWhoCommented_id: userWhoCommented_id,
                userWhoCommentIsFor_id: userWhoCommentIsFor_id,
                date: new Date(),
                comment: comment,
                spam:[]
            };
            return commentCollection.insertOne(newComment).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getCommentById(newId);
            });
        });
    },
    removeComment(id) {
        console.log(`ID of comment to delete is ${id}`)
        return comments().then((commentCollection) => {
            return commentCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete comment with id of ${id}`)
                } else { }
            });
        });
    },
    updateComment(id, userWhoCommented_id, userWhoCommentIsFor_id, comment, userFlagged_id, flagReason) {
        return comments().then((commentCollection) => {
            let updatedComment = {
                userWhoCommented_id: userWhoCommented_id,
                userWhoCommentIsFor_id: userWhoCommentIsFor_id,
                date: new Date(),
                comment: comment,
                spam:[
                    {
                        userFlagged_Id: userFlagged_id,
                        flagReason: flagReason
                    }
                ]
            };
            return commentCollection.updateOne({ _id: id }, updatedComment).then((result) => {
                return this.getCommentById(id);
            });
        });
    },
    addSpamFlagToComment(id, userFlagged_Id, flagReason)
    {
        if (!id)
            return Promise.reject("Must provide a comment id");
        if (!userFlagged_Id)
            return Promise.reject("Must provide id of user that flagged");
        if (!flagReason)
            return Promise.reject("Must provide reason for flagging comment as spam");
        
        return comments().then((commentCollection)=>
        {
            let newSpamFlag =
            {
                userFlagged_Id: userFlagged_Id,
                flagReason: flagReason
            };

            return commentCollection.update({_id: id}, {$push: {"spam": newSpamFlag}}).then((result) =>
            {
                if (!result)
                    return Promise.reject("Problem flagging comment as spam");
                return this.getCommentById(id);
            });
        });
    },
    getAllSpamComments()
    {
        return comments().then((commentCollection) =>
        {
            return commentCollection.find({spam: {$gt: []}}).toArray()
        })
    },
    removeSpamFlagFromComment(id)
    {
        return comments().then((commentCollection) =>
        {
            return commentCollection.update({_id: id}, {$set: {spam: []}}).then((result) =>
            {
                if (!result)
                    return Promise.reject("Problem unflagging comment as spam");
                return this.getCommentById(id);
            })
        })
    }
}

module.exports = exportedMethods;

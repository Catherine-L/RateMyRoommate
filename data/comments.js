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
    addComment(userWhoCommented_id, userWhoCommentIsFor_id, comment, userFlagged_id, flagReason) {
        return comments().then((commentCollection) => {
            let newComment = {
                _id: uuid.v4(),
                userWhoCommented_id: userWhoCommented_id,
                userWhoCommentIsFor_id: userWhoCommentIsFor_id,
                date: new.Date(),
                comment: comment,
                spam:[
                    {
                        userFlagged_id: userFlagged_id,
                        flagReason: flagReason
                    }
                ]
            };
            return commentCollection.insertOne(newComment).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getCommentById(newId);
            });
        });
    },
    removeComment(id) {
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
                date: new.Date(),
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
    }
}

module.exports = exportedMethods;
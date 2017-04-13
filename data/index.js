// copied from lecture 8 code data/index.js
const userData = require("./users");
const commentData = require("./comments");
const ratingData = require("./ratings");

module.exports = {
    users: userData,
    comments: commentData,
    ratings: ratingData
};
const collections = require("../../config/mongoCollections");
const comments = collections.comments;
const users = collections.users;
const fs = require('fs');

/* Insert mock users */

fs.readFile(__dirname + "/mock/users.json", (err, data) => {

    let usersArr = JSON.parse(data);

    if(!usersArr || usersArr.length < 1) return;

    users().then(collection => collection.insertMany(usersArr));
});


/* Insert mock comments */
/* TODO: add mock comments to mock/comments.json*/
fs.readFile(__dirname + "/mock/comments.json", (err, data) => {

    let commentsArr = JSON.parse(data);
    //console.log(JSON.parse(data))

    if(!commentsArr || commentsArr.length < 1) return;

    comments().then(collection => collection.insertMany(commentsArr));
});



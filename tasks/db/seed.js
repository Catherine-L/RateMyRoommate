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
/* TODO: add mock comments to mock/comments.json
fs.readFile(__dirname + "/mock/comments.json", (err, data) => {

    let comments = JSON.parse(data);

    if(!comments || comments.length < 1) return;

    users().then(collection => collection.insertMany(comments));
});
*/



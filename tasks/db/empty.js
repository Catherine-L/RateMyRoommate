const collections = require("../../config/mongoCollections");
const comments = collections.comments;
const users = collections.users;

comments().then((commentsCollection) => commentsCollection.remove({}));
users().then((usersCollection) => usersCollection.remove({}));


const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('node-uuid');

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) throw "User not found";
                return user;
            });
        });
    },
    addUser(firstname, lastname, email, password, city, state, country) {
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                address:{
                    city: city,
                    state: state,
                    country: country
                },
                ratings:{
                    ratingCount: 0,
                    cleanlyAverage: 0,
                    loudAverage: 0,
                    annoyingAverage: 0,
                    friendlyAverage: 0,
                    considerateAverage: 0,
                }
            };
            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });
    },
    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
    updateUser(id, firstname, lastname, email, password, city, state, country, ratingCount, cleanlyAverage, 
    loudAverage, annoyingAverage, friendlyAverage, considerateAverage) {
        return this.getUserById(id).then((currentUser) => {
            let updatedUser = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                address:{
                    city: city,
                    state: state,
                    country: country
                },
                ratings:{
                    ratingCount: ratingCount,
                    cleanlyAverage: cleanlyAverage,
                    loudAverage: loudAverage,
                    annoyingAverage: annoyingAverage,
                    friendlyAverage: friendlyAverage,
                    considerateAverage: considerateAverage
                }
            };
            return userCollection.updateOne({ _id: id }, updatedUser).then(() => {
                return this.getUserById(id);
            });
        });
    },
}

module.exports = exportedMethods;
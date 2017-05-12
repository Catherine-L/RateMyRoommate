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
     getUserByEmail(email) {
         //console.log(`looking for user with email ${email}`)
        return users().then((userCollection) => {
            return userCollection.findOne({ email: email }).then((user) => {
                if (!user) return Promise.reject("User not found");
                return user;
            });
        })
         .catch((err) => 
        {
            console.log(err)
        })
    },
    addUser(firstName, lastName, email, password, city, state, country) {
        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                isAdmin: false,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                address:{
                    city: city,
                    state: state,
                    country: country
                },
                bio: null,
                ratings:{
                    ratingCount: 0,
                    cleanlyAverage: 0,
                    loudAverage: 0,
                    annoyingAverage: 0,
                    friendlyAverage: 0,
                    considerateAverage: 0,
                    detail:[
                        {
                            userWhoRated_id: null,
                            cleanlyRating: 0,
                            loudRating: 0,
                            annoyingRating: 0,
                            friendlyRating: 0,
                            considerateRating: 0
                        }
                    ]
                }
            };
            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                if (!newInsertInformation)
                    return Promise.reject("Unable to add user");
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        })
        .catch((err) => 
        {
            console.log(err)
        })
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
    updateUserProfile(id, city, state, country, bio) {
        return users().then((userCollection) =>{
            let addressDetails = {
                    "city": city,
                    "state": state,
                    "country": country
            };
            
            return userCollection.updateOne({_id: id}, {
                $set: {
                    "address": addressDetails,
                    "bio": bio
                }}).then((result) =>{
                    if (!result)
                    return Promise.reject("Unable to add rating");
                });
        });
    },
    addRatingToUser(id, userWhoRatedId, cleanlyRating,loudRating,annoyingRating,friendlyRating,considerateRating)
    {
        return users().then((userCollection) =>
        {
            let ratingDetails = 
            {
                userWhoRated_id: userWhoRatedId,
                cleanlyRating: cleanlyRating, 
                loudRating: loudRating, 
                annoyingRating: annoyingRating, 
                friendlyRating: friendlyRating,
                considerateRating: considerateRating
            };

            return userCollection.update({_id: id}, {$push: {"ratings.detail": ratingDetails}}).then((result) =>
            {
                if (!result)
                    return Promise.reject("Unable to add rating");
               
                return this.getUserById(id).then((user) =>
                {
                    let detail = user.ratings.detail;
                    let ratingCount = 0;
                    let cleanlyAverage = 0;
                    let loudAverage = 0;
                    let annoyingAverage = 0;
                    let friendlyAverage = 0;
                    let considerateAverage = 0;

                    for (i in detail)
                    {
                        ratingCount++;
                        cleanlyAverage += parseInt(detail[i].cleanlyRating);
                        loudAverage += parseInt(detail[i].loudRating);
                        annoyingAverage += parseInt(detail[i].annoyingRating);
                        friendlyAverage += parseInt(detail[i].friendlyRating);
                        considerateAverage += parseInt(detail[i].considerateRating);
                    }

                    cleanlyAverage /= ratingCount;
                    loudAverage /= ratingCount;
                    annoyingAverage /= ratingCount;
                    friendlyAverage /= ratingCount;
                    considerateAverage /= ratingCount;

                    let updateCommand =
                    {
                        $set: { "ratings.ratingCount": ratingCount,
                            "ratings.cleanlyAverage": cleanlyAverage,
                            "ratings.loudAverage": loudAverage,
                            "ratings.annoyingAverage": annoyingAverage,
                            "ratings.friendlyAverage": friendlyAverage,
                            "ratings.considerateAverage": considerateAverage }
                    }

                    return userCollection.updateOne({_id: id}, updateCommand).then((result) =>
                    {
                        if (!result)
                            return Promise.reject("Error updating averages");
                        
                        return this.getUserById(id);
                    });
                });
            });
        });
    }
}

module.exports = exportedMethods;

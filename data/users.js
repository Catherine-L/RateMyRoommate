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

    getUsersByName(name) {

        let resultsArr = [];

        let firstName = new RegExp(name.trim().split(" ")[0], 'i');
        let lastName = new RegExp(name.trim().split(" ")[1] || firstName, 'i'); // defaults to firstName

        let userCollection;

        let usersFound = new Map();

        return users().then(collection => {

            userCollection = collection;

            return userCollection.find({ firstName, lastName }).toArray()

        }).then((nameResults) => {

            resultsArr = resultsArr.concat(nameResults);

            resultsArr.forEach(user => usersFound.set(user._id, true));

            return userCollection.find({ firstName }).toArray();

        }).then((firstNameResults) => {

            let filteredFirstNames = firstNameResults.filter(user => !usersFound.has(user._id));

            filteredFirstNames.forEach(user => usersFound.set(user._id, true));

            resultsArr = resultsArr.concat(filteredFirstNames);

            return userCollection.find({ lastName }).toArray()

        }).then((lastNameResults) => {

            let filteredLastNames = lastNameResults.filter(user => !usersFound.has(user._id));

            resultsArr = resultsArr.concat(filteredLastNames);

            return resultsArr;
        });

    },

    getUsersByLocation(stateParam, cityParam) {

        let regState = new RegExp(stateParam, 'i');
        let regCity = new RegExp(cityParam, 'i');

        return users().then(userCollection => {

            return userCollection.find({

                "address.state": regState,
                "address.city": regCity

            }).toArray();
        });
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
    updateUserProfile(id, firstName, lastName, email, city, state, country, bio) {
        return users().then((userCollection) =>{
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) {
                    throw "User not found";
                } else {
                    if(firstName) 
                        user.firstName = firstName;
    	            if(lastName) 
    		            user.lastName = lastName;
    	            if(email) 
    		            user.email = email;
                    if(city)
                        user.address.city = city;
    		        if(state) 
                        user.address.state = state;
                    if(country) 
                        user.address.country = country;  
                    if(bio) 
    		            user.bio = bio; 
                    return userCollection.updateOne({_id: id}, {$set: user}).then((result) => {
                        if (!result) return Promise.reject("Unable to update Profile");
                            return this.getUserById(id);
                    }); 
                }
            });
    	});
    },
    addRatingToUser(id, userWhoRatedId, cleanlyRating,loudRating,annoyingRating,friendlyRating,considerateRating)
    {
        return users().then((userCollection) =>{
            let ratingDetails = {
                userWhoRated_id: userWhoRatedId,
                cleanlyRating: cleanlyRating, 
                loudRating: loudRating, 
                annoyingRating: annoyingRating, 
                friendlyRating: friendlyRating,
                considerateRating: considerateRating
            };
            return userCollection.update({_id: id}, {$push: {"ratings.detail": ratingDetails}}).then((result) =>{
                if (!result)
                    return Promise.reject("Unable to add rating");
               
                return this.getUserById(id).then((user) =>{
                    let detail = user.ratings.detail;
                    let ratingCount = 0;
                    let cleanlyAverage = 0;
                    let loudAverage = 0;
                    let annoyingAverage = 0;
                    let friendlyAverage = 0;
                    let considerateAverage = 0;

                    for (i in detail){
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
};

// Utility functions

function capFirst(str) {

    return (str && str.length > 1) ?
        str[0].toUpperCase() + str.slice(1).toLowerCase() :
        str;
}

module.exports = exportedMethods;

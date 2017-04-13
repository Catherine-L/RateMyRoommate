// copied from lecture 8 code data/posts.js

const mongoCollections = require("../config/mongoCollections");
const ratings = mongoCollections.ratings;
const users = require("./users");
const uuid = require('node-uuid');

let exportedMethods = {
    getAllRatings() {
        return ratings().then((ratingCollection) => {
            return ratingCollection.find({}).toArray();
        })
    },
    getRatingById(id) {
        return ratings().then((ratingCollection) => {
            return ratingCollection.findOne({ _id: id }).then((rating) => {
                if (!rating) throw "rating not found";
                return rating;
            });
        });
    },
    addRating(userWhoRated_Id, userWhoRatingIsFor_Id, cleanlyRating, loudRating, 
    annoyingRating, friendlyRating, considerateRating) {
        return ratings().then((ratingCollection) => {
            let newRating = {
                _id: uuid.v4(),
                userWhoRated_id: userWhoRated_Id,
                userWhoRatingIsFor_id: userWhoRatingIsFor_Id,
                date: new.Date(),
                details:{
                    cleanlyRating: cleanlyRating,
                    loudRating: loudRating,
                    annoyingRating: annoyingRating,
                    friendlyRating: friendlyRating,
                    considerateRating: considerateRating
                }
            };
            return ratingCollection.insertOne(newRating).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getRatingById(newId);
            });
        });
    },
    removeRating(id) {
        return ratings().then((ratingCollection) => {
            return ratingCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete rating with id of ${id}`)
                } else { }
            });
        });
    },
    updateRating(id, userWhoRated_Id, userWhoRatingIsFor_Id, cleanlyRating, loudRating, 
    annoyingRating, friendlyRating, considerateRating) {
        return ratings().then((ratingCollection) => {
            let updatedRating = {
                userWhoRated_id: userWhoRated_Id,
                userWhoRatingIsFor_id: userWhoRatingIsFor_Id,
                date: new.Date(),
                details:{
                    cleanlyRating: cleanlyRating,
                    loudRating: loudRating,
                    annoyingRating: annoyingRating,
                    friendlyRating: friendlyRating,
                    considerateRating: considerateRating
                }
            };
            return ratingCollection.updateOne({ _id: id }, updatedRating).then((result) => {
                return this.getRatingById(id);
            });
        });
    }
}

module.exports = exportedMethods;
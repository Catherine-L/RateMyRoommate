const express = require('express');
const router = express.Router();
const userData = require("../data/users");

router.get('/', (req, res) => {

    res.render('search', {searchPage: true});
});

router.get('/name/:name', (req, res) => {

    let name = req.params.name;

    userData.getUsersByName(name)
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error }));
});

router.get('/state/:state/city/:city', (req, res) => {

    let state = req.params.state;
    let city = req.params.city;

    userData.getUsersByLocation(state, city)
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error }));
});

module.exports = router;

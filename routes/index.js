// copied from lecture 8 code route/index.js

//const commentRoutes = require("./comments");
const userRoutes = require("./users");
const homeRoute = require("./home")
const loginRoute = require("./login")

const constructorMethod = (app) => {
    //app.use("/comments", commentRoutes);
    app.use("/users", userRoutes);
    app.use('/home', homeRoute)
    app.use('/login', loginRoute)
    app.use('/', (req, res) => {
        res.render('home', {user: req.user})
    })
};

module.exports = constructorMethod;

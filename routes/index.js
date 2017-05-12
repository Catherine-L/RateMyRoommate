//const commentRoutes = require("./comments");
const userRoutes = require("./users");
const homeRoute = require("./home")
const loginRoute = require("./login")
const signupRoute = require("./signup")
const rateRoute = require("./rate")
const profileEditRoute = require("./profile-edit")

const constructorMethod = (app) => {
    //app.use("/comments", commentRoutes);
    app.use("/users", userRoutes);
    app.use('/home', homeRoute)
    app.use('/login', loginRoute)
    app.use('/signup', signupRoute)
    app.use('/rate', rateRoute)
    app.use('/profile-edit', profileEditRoute)
    app.use('/', (req, res) => {
        res.render('home', {user: req.user})
    })
    app.use('*', (req, res) => {
        res.status(404).json({error: 'nothing here'})
    })
};

module.exports = constructorMethod;


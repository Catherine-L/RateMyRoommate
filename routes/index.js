//const commentRoutes = require("./comments");
const userRoutes = require("./users");
const homeRoute = require("./home");
const loginRoute = require("./login");
const signupRoute = require("./signup");
const manageRoute = require("./manage");
const rateRoute = require("./rate");
const profileEditRoute = require("./profile-edit");
const searchRoute = require("./search");

const constructorMethod = (app) => {
    //app.use("/comments", commentRoutes);
    app.use("/users", userRoutes);
    app.use('/home', homeRoute);
    app.use('/login', loginRoute);
    app.use('/signup', signupRoute);
    app.use('/rate', rateRoute);
    app.use('/profile-edit', profileEditRoute);
    app.use('/manage', manageRoute);
    app.use('/search', searchRoute);
    app.use('/', (req, res) => {
        res.render('home', {loggedIn: req.user})
    });
    app.use('*', (req, res) => {
        res.status(404).json({error: 'nothing here'})
    });
};

module.exports = constructorMethod;


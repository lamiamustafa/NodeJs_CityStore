const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signup').post((req, res) => {
    const {username, email, password} = req.body;
    const dbUrl = process.env.mongodbUrl;
    const dbname = 'citystoredb';

    (async function addUser(){
        let client;
        try {
            client = await MongoClient.connect(dbUrl);
            debug('connected to mongodb...');
            const db = client.db(dbname);
            const user = {username, email, password};
            const results = await db.collection("users").insertOne(user);

            req.login(user, () => {
                res.redirect('/auth/profile');
            });
            
            client.close();
        } catch (error) {
            debug(error);
        }
    }())

});

authRouter.route('/signIn').get((req, res) => {
    res.render('signin');
}).post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureMessage: '/'
}));
authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
});

module.exports = authRouter;
const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy(){
    passport.use(new Strategy({
        usernameField: 'username',
        passportField: 'password'
    },
    (username, password, done) => {
        
        const dbUrl = process.env.mongodbUrl;
        const dbname = 'citystoredb';
        (async function validateUser(){
            let client;
            try {
                client = await MongoClient.connect(dbUrl);
                debug('connected to mongodb...');
                const db = client.db(dbname);
                const user = await db.collection("users").findOne({username});
                
                if(user && user.password === password){
                    done(null, user);
                }else{
                    done(null, false);
                }                
                client.close();
            } catch (error) {
                done(error, false )
            }
        }())
    }
    ));    
};
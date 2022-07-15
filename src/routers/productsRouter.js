const express = require('express');
const debug = require('debug')('app:productsRouter');
const {MongoClient, ObjectID } = require('mongodb');

const productsRouter = express.Router();

productsRouter.use((req, res, next) =>{
    if(req.user)
        next();
    else
        res.redirect('/auth/signin');
});

productsRouter.route('/').get((req, res) => {

    const dbUrl = process.env.mongodbUrl;
    const dbname = 'citystoredb';
    debug('connecting to mongodb...');

    (async function mongo(){

        let client ;
        try {
            debug('connecting to mongodb...');
            client = await MongoClient.connect(dbUrl);
            debug('connected to mongodb...');

            const db = client.db(dbname);
            const products = await db.collection("products").find().toArray();

            res.render('products', { products });
            client.close();
        } catch (error) {
            debug(error.stack);
        }

    }())

});

productsRouter.route('/:id').get((req, res) => {
let id = req.params.id;

const dbUrl = process.env.mongodbUrl;
    const dbname = 'citystoredb';
    debug('connecting to mongodb...');

    (async function mongo(){

        let client ;
        try {
            debug('connecting to mongodb...');
            client = await MongoClient.connect(dbUrl);
            debug('connected to mongodb...');

            const db = client.db(dbname);
            const product = await db.collection("products").findOne({_id: new ObjectID(id)});

            res.render("product", { product });
            client.close();
        } catch (error) {
            debug(error.stack);
        }

    }())



});

module.exports = productsRouter;
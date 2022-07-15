const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');

var products = [
    {name:'pepsi', description: 'This is pepsi'},
    {name:'merinda', description: 'This is merinda'},
    {name:'fayrous', description: 'This is fayrous'},
    {name:'beril', description: 'This is beril'}
];

const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
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
            const response = await db.collection("products").insertMany(products);
            res.json(response);

            client.close();
        } catch (error) {
            debug(error.stack);
        }

    }())
});

module.exports = adminRouter;
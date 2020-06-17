const admin = require('firebase-admin');
require('firebase/firestore');
const serviceAccount = require('./d1-firestore.json');
const config = require('./config.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
});

const db = admin.firestore();

exports.db = db;

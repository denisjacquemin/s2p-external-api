import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors'; 

admin.initializeApp();

import { userRoutesConfig } from './users/routes-config';
import { messageRoutesConfig } from './messages/routes-config';
import { authRoutesConfig } from './auth/routes-config';

const messageEventTriggers = require('./messages/events-triggers');
exports.onMessageCreate = messageEventTriggers.onMessageCreate;



const appV1 = express();
appV1.use(cors({ origin: true }));

userRoutesConfig(appV1)
messageRoutesConfig(appV1)
authRoutesConfig(appV1)

const main = express();
main.use('/v1', appV1);


// const db = admin.firestore();

// app.get('/h', (req, res) => {
//     res.status(200).send('hello world');
// })

// // Create
// app.post('/message', async (req, res) => {
//     try {
//         await db.collection('messages').doc().create(
//             {
//                 title: req.body.title
//             }
//         )
//         res.status(200).send()

//     } catch (error) {
//         res.status(500).send()
//     }

// })

// Read
// app.get('/message/:id', async (req, res) => {
//     try {
//         const message = await db.collection('messages').doc(req.params.id).get()

//         if (message.exists) {
//             res.status(200).send(
//                 {
//                     code: 'api-message-found',
//                     message: 'Message found',
//                     data: message.data()
//                 }
//             )
//         } else {
//             res.status(200).send(
//                 {
//                     code: 'api-message-not-found',
//                     message: 'Message not found'
//                 }
//             )
//         }
//     } catch (error) {
//         res.status(500).send(
//             {
//                 code: 'api-message-internal-error',
//                 message: error
//             }
//         )
//     }

// })


exports.main = functions.https.onRequest(main);



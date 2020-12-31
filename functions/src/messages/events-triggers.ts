import * as functions from 'firebase-functions';
import * as https from 'https';

// import * as admin from 'firebase-admin'

// const db = admin.firestore();


exports.onMessageCreate = functions.firestore
    .document('messages/{messageId}')
    .onCreate((snap, context) => {
        console.log('I am in onMessaggeCreate from events-triggers');
        return new Promise((resolve, reject) => {
            const hostname = info.hostname;
            const pathname = info.pathname;
            let data = '';
            const request = https.get(`https://${hostname}${pathname}`, (res) => {
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', resolve);
            });
            request.on('error', reject);
        });
    });
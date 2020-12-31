import { Request, Response } from "express";
import * as admin from 'firebase-admin'

const db = admin.firestore();

export async function create(req: Request, res: Response) {
    try {
        const { title, content, konecto_id, winpage_matricule, proeco_id } = req.body

        if (!title || !content || (!konecto_id && !winpage_matricule && !proeco_id)) {
            return res.status(400).send({ 
                "error": {
                    "code": 400,
                    "message": "MISSING_FIELDS"
                }
            })
        }

        // Check if ID is known
        const studentsSnap = await db.collection('students')
        .where("winpage_matricule", "==", winpage_matricule)
        .get();

        const student_recipients_ids: number[] = []
        if (studentsSnap.empty) {
            return res.status(200).send({ 
                "error": {
                    "code": 200,
                    "message": "ID not found"
                }
            })
        } else {
            studentsSnap.forEach(snap => {
                const data = snap.data()
                student_recipients_ids.push(data.konecto_id)
            })
        }

        const message = {
            title: title,
            content: content,
            students: student_recipients_ids,
            recipient: {
                konecto_id: konecto_id,
                winpage_matricule: winpage_matricule,
                proeco_id: proeco_id
            },
            createdBy: {
                uid: res.locals.uid,
                email: res.locals.email
            }
        }

        // needs to check if konecto_id or winpage_matricule exists
        


        // see https://gist.github.com/CodingDoug/814a75ff55d5a3f951f8a7df3979636a
        // async function getIsCapitalOrCountryIsItaly() {
        //     const isCapital = citiesRef.where('capital', '==', true).get();
        //     const isItalian = citiesRef.where('country', '==', 'Italy').get();
    
        //     const [capitalQuerySnapshot, italianQuerySnapshot] = await Promise.all([
        //       isCapital,
        //       isItalian
        //     ]);
    
        //     const capitalCitiesArray = capitalQuerySnapshot.docs;
        //     const italianCitiesArray = italianQuerySnapshot.docs;
    
        //     const citiesArray = capitalCitiesArray.concat(italianCitiesArray);
    
        //     return citiesArray;
        //   }

        await db.collection('messages').doc().create({message})

        return res.status(201).send({ message })

    } catch (err) {
        return handleError(res, err)
    }
}

// export async function all(req: Request, res: Response) {
//     try {
//         const listMessages = await admin.auth().listMessages()
//         const messages = listMessages.messages.map(message => {
//             const customClaims = (message.customClaims || { role: '' }) as { role?: string }
//             const role = customClaims.role ? customClaims.role : ''
//             return {
//                 uid: message.uid,
//                 email: message.email,
//                 displayName: message.displayName,
//                 role,
//                 lastSignInTime: message.metadata.lastSignInTime,
//                 creationTime: message.metadata.creationTime
//             }
//         })

//         return res.status(200).send({ messages })
//     } catch (err) {
//         return handleError(res, err)
//     }
// }

// export async function get(req: Request, res: Response) {
//     try {
//         const { id } = req.params
//         const message = await admin.auth().getMessage(id)
//         return res.status(200).send({ message })
//     } catch (err) {
//         return handleError(res, err)
//     }
// }

// export async function patch(req: Request, res: Response) {
//     try {
//         const { id } = req.params
//         const { displayName, password, email, role } = req.body

//         if (!id || !displayName || !password || !email || !role) {
//             return res.status(400).send({ message: 'Missing fields' })
//         }

//         const message = await admin.auth().updateMessage(id, { displayName, password, email })
//         await admin.auth().setCustomMessageClaims(id, { role })
//         return res.status(204).send({ message })
//     } catch (err) {
//         return handleError(res, err)
//     }
// }

// export async function remove(req: Request, res: Response) {
//     try {
//         const { id } = req.params
//         await admin.auth().deleteMessage(id)
//         return res.status(204).send({})
//     } catch (err) {
//         return handleError(res, err)
//     }
// }

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
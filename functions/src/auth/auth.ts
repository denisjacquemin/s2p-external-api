import { Request, Response } from "express";
import * as admin from 'firebase-admin';
import axios, { AxiosResponse } from 'axios';

export async function auth(req: Request, res: Response, next: Function) {

    try {
        const { email, password } = req.body

        // Authentication requests are POSTed, other requests are forbidden
        if (req.method !== 'POST') {
            return handleResponse(res, 403);
        }

        if (!email || !password) {
            return handleResponse(res, 400, { 
                "error": {
                    "code": 400,
                    "message": "MISSING_EMAIL_OR_PASSWORD",
                    "errors": [
                        {
                            "message": "MISSING_EMAIL_OR_PASSWORD",
                            "domain": "global",
                            "reason": "invalid"
                        }
                    ]
                }
            })
        }

        console.log('Email: ' + email + ' Password: ' + password);

        // TODO(DEVELOPER): In production you'll need to update the `authenticate` function so that it authenticates with your own credentials system.
        
        try {

            // test and handle Common error codes
            // EMAIL_NOT_FOUND: There is no user record corresponding to this identifier. The user may have been deleted.
            // INVALID_PASSWORD: The password is invalid or the user does not have a password.
            // USER_DISABLED: The user account has been disabled by an administrator.
            
            const signInResponse = await signIn(email, password)

            return handleResponse(res, 200, { 
                email: signInResponse.data.email, 
                idToken: signInResponse.data.idToken,
                expiresIn: signInResponse.data.expiresIn 
            });
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                return handleResponse(res, error.response.status, error.response.data)
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                return handleResponse(res, 500, error.request)

              } else {
                // Something happened in setting up the request that triggered an Error
                return handleResponse(res, 500, error.message)
              }
        }

        // On success return the Firebase Custom Auth Token.
        // const firebaseToken = await admin.auth().createCustomToken('uid');
        // return handleResponse(res, 200, { token: firebaseToken });

    } catch (error) {
        return handleError(res, error);
    }
}



export async function isAuthenticated(req: Request, res: Response, next: Function) {
    const { authorization } = req.headers

    if (!authorization)
        return handleResponse(res, 401, { 
            "error": {
                "code": 401,
                "message": "Unauthorized"
            }
        });

    if (!authorization.startsWith('Bearer'))
        return handleResponse(res, 401, { 
            "error": {
                "code": 401,
                "message": "Unauthorized"
            }
        });

    const split = authorization.split('Bearer ')
    if (split.length !== 2)
        return handleResponse(res, 401, { 
            "error": {
                "code": 401,
                "message": "Unauthorized"
            }
        });

    const token = split[1]

    try {
        console.log("token: ", JSON.stringify(token))
        const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
        console.log("decodedToken", JSON.stringify(decodedToken))
        res.locals = { ...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email }
        return next();
    }
    catch (err) {
        console.log('err' + err)
        // console.error(`${err.code} -  ${err.message}`)
        return handleResponse(res, 401, { 
            "error": {
                "code": 401,
                "message": "Unauthorized"
            }
        });
    }
}

const handleError = (res: Response, error: string) => {
    return res.status(500).send(error);
};

const handleResponse = (res: Response, status: number, body?: object) => {
    if (body) {
        return res.status(status).json(body);
    }
    return res.status(status).send();
};

const signIn = (email: string, password: string):
    Promise<AxiosResponse> => {
    
    return axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAIW2DlXQ5VOinoUezj8iJ-L2_UmoKAVCQ', {
        email: email,
        password: password,
        returnSecureToken: true
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    // .then(response => {
    //     console.log("Response signIn!!")
    //     console.log('000')
    //     //console.log(response)
    //     return response
    // }).catch(error => {
    //     console.log("Error in signIn!!")

    //     if (error.response) {
    //         console.log('111')
    //         // The request was made and the server responded with a status code
    //         // that falls out of the range of 2xx
    //         console.log(error.response.data);
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //     } else if (error.request) {
    //         console.log('222')

    //         // The request was made but no response was received
    //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //         // http.ClientRequest in node.js
    //         console.log(error.request);
    //     } else {
    //         console.log('333')

    //         // Something happened in setting up the request that triggered an Error
    //         //console.log(error.message);
    //     }
    //     console.log('444')

    //     console.log(error);
    //     return error
    // });
}

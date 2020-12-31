import { Application } from "express";
import { auth } from "./auth";

export function authRoutesConfig(app: Application) {
    app.post('/signIn',
        auth
    );
    //..
    // lists all messages
    // app.get('/messages', [
    //     isAuthenticated,
    //     isAuthorized({ hasRole: ['admin', 'manager'] }),
    //     all
    // ]);
    // // get :id message
    // app.get('/messages/:id', [
    //     isAuthenticated,
    //     isAuthorized({ hasRole: ['admin', 'manager'], allowSameMessage: true }),
    //     get
    // ]);
    // // updates :id message
    // app.patch('/messages/:id', [
    //     isAuthenticated,
    //     isAuthorized({ hasRole: ['admin', 'manager'], allowSameMessage: true }),
    //     patch
    // ]);
    // // deletes :id message
    // app.delete('/messages/:id', [
    //     isAuthenticated,
    //     isAuthorized({ hasRole: ['admin', 'manager'] }),
    //     remove
    // ]);
}
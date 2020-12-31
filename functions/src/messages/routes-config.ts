import { Application } from "express";
import { create } from "./controller";
import { isAuthenticated } from "../auth/auth";
// import { isAuthorized } from "../auth/authorized";

export function messageRoutesConfig(app: Application) {    
    app.post('/message',
        isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager'] }),
        create
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
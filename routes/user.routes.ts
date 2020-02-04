import { Router, Request, Response } from "express";
import { User } from '../models/user.model';
import bcryptjs from 'bcryptjs';
import { json } from "body-parser";
import Token from '../classes/token';
import { verifyToken } from '../middlewares/authentication';


const userRoutes = Router();

// login
userRoutes.post('/login', (request: Request, response: Response) => {
    const body = request.body;
    
    User.findOne({email: body.email}, (error, responseDB) => {
        if(error) {
            throw error;
        }

        if(!responseDB) {
            return response.json({
                ok: false,
                message: 'User/Password wrong'
            });
        }
        
        if(responseDB.comparePassword(body.password)) {

            const token = Token.getJwtToken({
                _id: responseDB._id,
                name: responseDB.name,
                email: responseDB.email,
                avatar: responseDB.avatar
            });

            response.json({
                ok: true,
                token
            });
        } else {
            response.json({
                ok: false,
                message: 'User/Password wrong ***'
            });
        }
    });
});

// create
userRoutes.post('/', (request: Request, response: Response) => {

    const user = {
        name: request.body.name,
        email: request.body.email,
        password: bcryptjs.hashSync(request.body.password, 10),
        avatar: request.body.avatar
    };

    User.create(user).then( responseDB => {
        const token = Token.getJwtToken({
            _id: responseDB._id,
            name: responseDB.name,
            email: responseDB.email,
            avatar: responseDB.avatar
        });

        response.json({
            ok: true,
            token
        });

    } )
    .catch( error => {
        response.json({
            ok: false,
            error
        });
    } );

});

// update
userRoutes.put('/', verifyToken, (request: any, response: Response) => {

    const user = {
        name: request.body.name || request.user.name,
        email: request.body.email || request.user.email,
        avatar: request.body.avatar || request.user.avatar
    };

    User.findByIdAndUpdate(request.user._id, user, {new: true}, (error, responseDB) => {
        if(error) throw error;

        if(!responseDB) {
            return response.json({
                ok: false,
                message: 'User not found'
            });
        }

        const token = Token.getJwtToken({
            _id: responseDB._id,
            name: responseDB.name,
            email: responseDB.email,
            avatar: responseDB.avatar
        });

        response.json({
            ok: true,
            token
        });
    });

});

userRoutes.get('/', verifyToken, (request: any, response: Response) => {
    const user = request.user;

    response.json({
        ok: true,
        user
    });
});

export default userRoutes;
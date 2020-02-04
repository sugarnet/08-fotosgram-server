import { Request, Response, NextFunction, request } from 'express';
import Token from '../classes/token';

export const verifyToken = (request: any, response: Response, next: NextFunction) => {
    const userToken = request.get('x-token') || '';

    Token.verifyToken(userToken).then( (decoded: any) => {
        console.log('Decoded', decoded);
        request.user = decoded.user;
        next();
    }).catch( error => {
        response.json({
            ok: false,
            message: 'Invalid token'
        });
    } );

}
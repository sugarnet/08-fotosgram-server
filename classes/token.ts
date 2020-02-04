import jwt from 'jsonwebtoken'

export default class Token {

    private static SEED: string = 'this-is-my-seed-for-the-jwt-token';
    private static EXPIRATION: string = '30d';

    constructor() {}

    static getJwtToken( payload: any ): string {
        return jwt.sign({
            user: payload
        }, this.SEED, {expiresIn: this.EXPIRATION});
    }

    static verifyToken(userToken: string) {
        return new Promise( (resolve, reject) => {
            jwt.verify(userToken, this.SEED, (error, decoded) => {
                if(error) {
                    reject();
                } else {
                    resolve(decoded);
                }
            });
        } );
    }
}
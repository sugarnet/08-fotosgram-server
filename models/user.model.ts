
import { Schema, Document, model } from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email es required']
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    }
});

userSchema.method('comparePassword', function(password: string = ''): boolean {

    if( bcryptjs.compareSync(password, this.password) ) {
        return true;
    } else {
        return false;
    }
});

interface IUser extends Document {
    name: string,
    avatar: string,
    email: string,
    password: string

    comparePassword(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';
import { FileUpload } from '../interfaces/file-upload';

export default class FileSystem {

    constructor() {}

    saveTemporalImage(file: FileUpload, userId: string) {

        return new Promise( (resolve, reject) => {

            const path = this.createFolderUser(userId);
    
            const name = this.generateName(file.name);

            file.mv(`${path}/${name}`, (error: any) => {

                if(error) {
                    reject();
                } else {
                    resolve();
                }
            });
        } );

    }

    moveFromTempToPost( userId: string ) {
        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if(!fs.existsSync(pathTemp)) {
            return [];
        }

        if(!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imgsTemp = this.getImgsFromTemp(userId);

        imgsTemp.forEach(img => {
            fs.renameSync(`${pathTemp}/${img}`, `${pathPost}/${img}`);
        });

        return imgsTemp;
    }

    getImageUrl(userId: string, img: string) {
        const pathImg = path.resolve(__dirname, '../uploads/', userId, 'posts', img);

        if(!fs.existsSync(pathImg)) {
            return path.resolve(__dirname, '../assets/imgs/', '400x250.jpg');
        }

        return pathImg;
    }

    private getImgsFromTemp(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];

    }

    private generateName(name: string) {

        const parts = name.split('.');
        const extension = parts[parts.length - 1];
        const id = uniqid();

        return `${ id }.${ extension }`;
    }

    private createFolderUser(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';

        const exists = fs.existsSync(pathUser);

        if(!exists) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }
}
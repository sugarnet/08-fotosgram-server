import { Router, Response, request } from 'express';
import { verifyToken } from '../middlewares/authentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

postRoutes.get('/', async (request: any, response: Response) => {

    const page = Number(request.query.page) || 1;
    const skip = (page - 1) * 10;

    const posts = await Post.find()
                            .sort({_id: -1})
                            .populate('user', '-password')
                            .limit(10)
                            .skip(skip)
                            .exec();

    response.json({
        ok: true,
        posts
    });

});

// create
postRoutes.post('/', [verifyToken], (request: any, response: Response) => {

    const body = request.body;
    body.user = request.user._id;

    const imgs = fileSystem.moveFromTempToPost(request.user._id);
    body.imgs = imgs;

    Post.create(body).then(async responseDB => {

        await responseDB.populate('user', '-password').execPopulate();

        response.json({
            ok: true,
            post: responseDB
        });

    }).catch(error => {
        response.json({
            ok: false,
            error
        });
        
    });

});

// upload
postRoutes.post('/upload', [verifyToken], async (request: any, response: Response) => {

    if(!request.files) {
        response.status(400).json({
            ok: false,
            message: 'There isn\'t uploaded files'
        });
    }
    
    const file: FileUpload = request.files.image;
    
    if (!file) {
        response.status(400).json({
            ok: false,
            message: 'There isn\'t a image'
        });

    }

    if (!file.mimetype.includes('image')) {
        response.status(400).json({
            ok: false,
            message: 'The file isn\'t a image'
        });

    }

    await fileSystem.saveTemporalImage(file, request.user._id);

    response.json({
        ok: true,
        file: file.mimetype
    });
});

// get
postRoutes.get('/image/:userId/:img', [verifyToken], async (request: any, response: Response) => {

    const userId = request.params.userId;
    const img = request.params.img;

    const pathImg = fileSystem.getImageUrl(userId, img);
    response.sendFile(pathImg);
});

export default postRoutes;
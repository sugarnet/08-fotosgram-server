import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import Server from './classes/server';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';

const server = new Server();

// body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload());

// connect db
mongoose.connect('mongodb://localhost:27017/fotosgram' ,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    (error) => {
        if(error) {
            throw error;
        }
        
        console.log('Database ONLINE!!!')
    });

// app routes
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

// init express
server.start( () => console.log(`Running in ${server.port}`) );
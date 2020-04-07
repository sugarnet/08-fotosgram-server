import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import Server from './classes/server';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import { json } from 'body-parser';

const server = new Server();

// body parser
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload());

// cors
// server.app.use(cors({origin: true, credentials: true}));

server.app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

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
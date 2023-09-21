import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import * as UserController from "./controllers/UserController.js";
import * as TestController from "./controllers/TestController.js";

import checkAuth from "./utils/checkAuth.js";
import * as validation from "./utils/validations.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import checkPermission from "./utils/checkPermission.js";

mongoose
    .connect('mongodb+srv://yeskendyr:jZbwFsvcgvdL04ws@cluster0.m7tuepw.mongodb.net/tutor?retryWrites=true&w=majority')
    .then(()=>console.log('DB connection OK'))
    .catch(err=>console.log('error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Salem Alem!');
});

app.post('/login', validation.login, handleValidationErrors, UserController.login);
app.post('/register', validation.register, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// app.get('/lessons', checkAuth, LessonController.getAll);
// app.get('/lesson/:key', checkAuth, LessonController.getOne);
// app.post('/lesson', checkAuth, checkPermission, validation.lessonForm, handleValidationErrors, LessonController.create);
// app.delete('/lesson/:id', checkAuth, checkPermission, LessonController.remove);
// app.patch('/lesson/:id', checkAuth, checkPermission, validation.lessonForm, handleValidationErrors, LessonController.update);

app.get('/quiz/:collectionName/:count', checkAuth, TestController.getQuiz); //for student
app.get('/collection/:collectionName', checkAuth, TestController.getCollection); //for teacher on admin panel

app.post('/test', checkAuth, TestController.add);
app.patch('/test/:id', checkAuth, TestController.update);
app.delete('/test/:id', checkAuth, TestController.remove);

app.post('/upload', checkAuth, upload.single('recfile'), (req, res) => {
    res.json({status: {type: 'success', message: req.file.originalname, description: 'File сәтті сақталды'}, file: {url: `/uploads/${req.file.originalname}`}})
});

app.listen(4444, (err) => {
    if(err) 
        return console.log(err);

    console.log('server OK on ', 4444);
})
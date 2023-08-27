import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import * as UserController from "./controllers/UserController.js";
import * as LessonController from "./controllers/LessonController.js";
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

app.use(express.json());
app.use('/uploads', checkAuth, express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Salem Alem!');
});

app.post('/auth/login', validation.login, handleValidationErrors, UserController.login);
app.post('/auth/register', validation.register, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/lessons', checkAuth, LessonController.getAll);
app.get('/lesson/:id', checkAuth, LessonController.getOne);
app.post('/lesson', checkAuth, checkPermission, validation.lessonForm, handleValidationErrors, LessonController.create);
app.delete('/lesson/:id', checkAuth, checkPermission, LessonController.remove);
app.patch('/lesson/:id', checkAuth, checkPermission, validation.lessonForm, handleValidationErrors, LessonController.update);

app.get('/tests/:key/:count', checkAuth, TestController.getQuiz);
app.get('/test/:id', checkAuth, TestController.getOne);
app.post('/test', checkAuth, checkPermission, TestController.create);
app.delete('/test/:id', checkAuth, checkPermission, TestController.remove);
app.patch('/test/:id', checkAuth, checkPermission, TestController.update);

app.post('/upload', checkAuth, upload.single('recfile'), (req, res) => {
    res.json({url: `/uploads/${req.file.originalname}`})
})

app.listen(4444, (err) => {
    if(err) 
        return console.log(err);

    console.log('server OK on ', 4444);
})
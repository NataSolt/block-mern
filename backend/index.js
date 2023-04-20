import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import {registerValidation} from "./validations/auth.js";
import UserModel from "./models/User.js"
import checkAuth from "./utils/checkAuth.js";
import User from "./models/User.js";
import {getMe, login, register} from "./controllers/UserController.js";

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.rdfzdip.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=> {console.log('DB Ok')})
    .catch((err)=> {console.log('DB error', err)})

const app = express();

app.use(express.json());

app.post('/auth/login', login)
app.post('/auth/register', registerValidation, register)
app.get('/auth/me', checkAuth, getMe)

app.listen(4444, (err)=> {
    if(err) {
        console.log(err)
    }
    console.log('Server OK')
} )
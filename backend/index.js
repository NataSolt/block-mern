import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import {registerValidation} from "./validations/auth.js";
import UserModel from "./models/User.js"
import checkAuth from "./utils/checkAuth.js";
import User from "./models/User.js";

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.rdfzdip.mongodb.net/blog?retryWrites=true&w=majority')
    .then(()=> {console.log('DB Ok')})
    .catch((err)=> {console.log('DB error', err)})

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email})//ищем пользователя в базе с таким емайлом
    if(!user){  //если ее нет возвращаем сообщение
        return res.status(404).json({
            message: 'Пользователь не найден'
        })
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)// проверяем совпадают ли пароли
    if(!isValidPass) {  //если они не равны вернем сообщение
        return res.status(400).json({
            message: 'Неверный логин или пароль'
        })
    }
        const token = jwt .sign({  //создаем токен  шифруем id для дальнейшей работы с юзером
                _id: user._id
            }, 'secret', //секретное слово
            { expiresIn: '30d'} ) //сколько дней валидным будет

        const {passwordHash, ...userData} = user._doc //вытаскиваем hash и возвращаем все остальное

        res.json({...userData, token})

    }catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Не удалось авторизироваться',
        })
    }

})

app.post('/auth/register', registerValidation, async (req,res)=> {
try{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    const password = req.body.password;// берем наш пароль с сервера
    const salt = await bcrypt.genSalt(10); //шифруем
    const hash = await bcrypt.hash(password, salt) //передаем зашифрованный пароль

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        passwordHash: hash,
        avatarUrl: req.body.avatarUrl,
    })
    const user = await doc.save()//сохраняем юзера в базе данных

    const token = jwt .sign({  //создаем токен  шифруем id для дальнейшей работы с юзером
        _id: user._id
    }, 'secret', //секретное слово
        { expiresIn: '30d'} ) //сколько дней валидным будет

    const {passwordHash, ...userData} = user._doc //вытаскиваем hash и возвращаем все остальное

    res.json({...userData, token})
}catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Не удалось зарегистрироваться',
    })
}
})

app.get('/auth/me', checkAuth, async (req, res)=> {
    try {
        const user = await UserModel.findById(req.userId)// из реквеста вытягиваем id
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const {passwordHash, ...userData} = user._doc //вытаскиваем hash и возвращаем все остальное
        res.json(userData)
    } catch(err){

    }
})

app.listen(4444, (err)=> {
    if(err) {
        console.log(err)
    }
    console.log('Server OK')
} )
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        if(req.body.parentId){
            const parent = await UserModel.findOne({_id: req.body.parentId});

            if(!parent)
                return res.status(404).json({status: 'error', message: 'Ұсынылған жетекші табылмады'});
        }

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            parent: req.body.parentId,
            avatarUrl: req.body.avatarUrl
        });

        const user = await doc.save();

        const token = jwt.sign(
            {_id: user._id,},
            'key',
            {expiresIn: '30d'}
        );

        const { passwordHash, __v, createdAt, updatedAt,  ...userData } = user._doc;

        res.json({...userData, token});
    } catch (err) {
        console.log(err)
        res.status(500).json({status: 'error', message: 'Жүйеге тіркелу орындалмады'});
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if(!user)
            return res.status(404).json({status: 'error', message: 'Электронды почта немесе құпиясөз қате!'});

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if(!isValidPass)
            return res.status(404).json({status: 'error', message: 'Электронды почта немесе құпиясөз қате!'});

        const token = jwt.sign(
            {_id: user._id,},
            'key',
            {expiresIn: '30d'}
        );

        const { passwordHash, __v, createdAt, updatedAt, ...userData } = user._doc;

        res.json({...userData, token});
    } catch (err) {
        console.log(err)
        res.status(500).json({status: 'error', message: 'Жүйеге кіру орындалмады'});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user)
            return res.status(404).json({status: 'error', message: 'Қолданушы табылмады'});
        
        const { passwordHash, __v, createdAt, updatedAt, ...userData } = user._doc;

        res.json(userData);
        } catch (err) {
            console.log(err)
            res.status(500).json({status: 'error', message: 'Рұқсат жоқ!'});
        }
};
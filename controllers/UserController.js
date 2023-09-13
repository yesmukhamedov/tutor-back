import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        let supervisorObjectId = null;

        if (req.body.supervisorId) {
            try {
                supervisorObjectId = new mongoose.Types.ObjectId(req.body.supervisorId);
            } catch (error) {
                return res.status(400).json({ status: 'error', message: 'Мұғалім кодының қате форматы' });
            }
        }
      
        if (supervisorObjectId) {
            const supervisor = await User.findOne({ _id: supervisorObjectId });
    
            if (!supervisor) {
                return res.status(404).json({ status: 'error', message: 'Ұсынылған жетекші табылмады' });
            }
        }

        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            supervisor: supervisorObjectId,
            avatarUrl: req.body.avatarUrl
        });

        await user.save();

        res.json({message: 'success'});
    } catch (err) {
        console.log(err)
        res.status(500).json({status: 'error', message: 'Жүйеге тіркелу орындалмады'});
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate({
            path: 'supervisor',
            select: '-passwordHash -updatedAt -createdAt -__v',
          });

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
        const user = await User.findById(req.userId).populate({
            path: 'supervisor',
            select: '-passwordHash -updatedAt -createdAt -__v',
          });

        if(!user)
            return res.status(404).json({status: 'error', message: 'Қолданушы табылмады'});
        
        const { passwordHash, __v, createdAt, updatedAt, ...userData } = user._doc;

        res.json(userData);
        } catch (err) {
            console.log(err)
            res.status(500).json({status: 'error', message: 'Рұқсат жоқ!'});
        }
};
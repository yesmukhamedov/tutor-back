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
                return res.status(400).json({status: { type: 'error', message: 'Тіркелу орындалмады', description: 'Мұғалім кодының қате форматы'}});
            }
        }
      
        if (supervisorObjectId) {
            const supervisor = await User.findOne({ _id: supervisorObjectId });
    
            if (!supervisor) {
                return res.status(404).json({status: { type: 'error', message: 'Тіркелу орындалмады', description: 'Ұсынылған жетекші жүйеден табылмады'}});
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

        res.json({status: {type: 'success', message: 'Қош келдіңіз!', description: 'Жүйеге тіркелу сәтті орындалды. Барлық мәліметтерді жеке парақшаңыздан тексере аласыз'}});
    } catch (err) {
        console.log(err)
        res.status(500).json({status: {type: 'error', message: 'Тіркелу орындалмады', description: 'Жүйеге тіркелу орындалмады'}});
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate({
            path: 'supervisor',
            select: '-passwordHash -updatedAt -createdAt -__v',
          });

        if(!user)
            return res.status(404).json({status: {type: 'error', message: 'Жүйеге кіру орындалмады', description: 'Электронды почта немесе құпиясөз қате!'}});

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if(!isValidPass)
            return res.status(404).json({status: {type: 'error', message: 'Жүйеге кіру орындалмады', description: 'Электронды почта немесе құпиясөз қате!'}});

        const token = jwt.sign(
            {_id: user._id,},
            'key',
            {expiresIn: '30d'}
        );

        const { passwordHash, __v, createdAt, updatedAt, ...userData } = user._doc;

        res.json({status: {type: 'success', message: 'Қош келдіңіз!', description: 'Жүйеге кіру сәтті орындалды'}, user: {...userData, token}});
    } catch (err) {
        console.log(err)
        res.status(500).json({status: {type: 'error', message: 'Жүйеге кіру орындалмады', description: 'Жүйеге кіру кезіндегі ескерту'}});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'supervisor',
            select: '-passwordHash -updatedAt -createdAt -__v',
          });

        if(!user)
            return res.status(404).json({status: {type: 'warning', message: 'Жүйеге тіркелмеген қолданушы', message: 'Қолданушы табылмады'}});
        
        const { passwordHash, __v, createdAt, updatedAt, ...userData } = user._doc;

        res.json({status: {type: 'success', message: user.fullName, description: 'Жүйеге қайта оралуыңызбен'}, user: userData});
        } catch (err) {
            res.status(500).json({status: {type: 'error', message: 'Қате', description: 'Қолданушыны жүйеден іздеу кезіндегі ескерту'}});
        }
};
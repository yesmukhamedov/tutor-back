import LessonModel from "../models/Lesson.js";
import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
    try {
        const lessons = await LessonModel.find().where('user').equals(req.userId).populate('user').exec();
        res.json(lessons);
    } catch (err) {
        console.log(err);
        res.status(404).json({message: 'Дәрістер табылмады'});
    }
};

export const getOne = async (req, res) => {
    try {
        const lesson = await LessonModel.findById(req.params.id).populate('user').exec();

        // LessonModel.findByIdAndUpdate(
        //     {_id: req.params.id},
        //     {$inc: {viewsCount: 1}},
        //     {returnDocument: 'after'},
        //     (err, doc) => {
        //         if(err){
        //             console.log(err);
        //             return res.status(500).json({message: 'findByIdAndUpdate: Дәрісті қайтармады (қатемен)'});
        //         }

        //         if(!doc){
        //             return res.status(404).json({message: 'findByIdAndUpdate Дәріс табылмады'});
        //         }

        //         res.json(doc);
        //     }
        // );

        res.json(lesson);
    } catch (err) {
        console.log(err);
        res.status(404).json({message: 'Дәрістер табылмады'});
    }
};

export const create = async (req, res) => {
    try {
        if(await UserModel.findById(req.userId).parrent)
            return res.status(403).json({message: 'Рұқсат жоқ!'});

        const doc = new LessonModel({
            content: req.body.content,
            key: req.body.key,
            title: req.body.title,
            user: req.userId
        });

        const lesson = await doc.save();

        res.json(lesson);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Сақтау орындалмады'});
    }
};

export const remove = async (req, res) => {
    try {

        if(!(await LessonModel.findById(req.params.id).user == req.userId))
            return res.status(403).json({message: 'Өшіру орындалмады (Рұқсат жоқ!)'});

        LessonModel.deleteOne({_id: req.params.id});

        // LessonModel.findByIdAndDelete({
        //     _id: req.params.id
        // }, (err, doc) => {
        //     if(err){
        //         console.log(err);
        //         return res.status(500).json({message: 'Өшіру орындалмады (Қате)'});
        //     }
        //     if(!doc)
        //         return res.status(404).json({message: 'Өшіру орындалмады (Дәріс табылмады)'});
        // });

        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Өшіру орындалмады'});
    }
};

export const update = async (req, res) => {
    try {

        if(!(await LessonModel.findById(req.params.id).user == req.userId))
            return res.status(403).json({message: 'Өңдеу орындалмады (Рұқсат жоқ!)'});

        await LessonModel.updateOne({
            _id: req.params.id,
        }, {
            content: req.body.content,
            key: req.body.key,
            title: req.body.title,
            user: req.userId
        });

        res.json({success: true});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Өңдеу орындалмады'});
    }
}
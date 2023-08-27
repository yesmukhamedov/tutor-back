import UserModel from "../models/User.js";
import QuestionModel from "../models/Question.js";
import OptionModel from "../models/Option.js";

export const getQuiz = async (req, res) => {
    try {
        // const tests = await TestModel.find().where('key').equals(req.params.id).populate('option').exec();

        res.json(await QuestionModel.aggregate([
            { $match: { key: req.params.key } },
            { $sample: { size: Math.min(parseInt(req.params.count), await QuestionModel.countDocuments({ key: req.params.key }))}},
            { $lookup: { from: 'options', localField: 'options', foreignField: '_id', as: 'options' } },
        ]));
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Тесттерді жүктеу кезіндегі қате'});
    }

    // try {
    //     const questions = await Question.find().populate('options');
    //     res.json(questions);
    // } catch (err) {
    //     res.status(500).json({message: 'Тесттерді жүктеу кезіндегі қате'});
    // }
};

export const create = async (req, res) => {
    try {
        // if(await UserModel.findById(req.userId).parrent)
        //     return res.status(403).json({message: 'Рұқсат жоқ!'});

        await QuestionModel.create({
            text: req.body.text,
            key: req.body.key,
            options: await OptionModel.create(options).map(option => option._id),
        });

        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Тесттерді сақтау кезіндегі қате'});
    }
};

export const getOne = async (req, res) => {
    try {
        const question = await QuestionModel.findById(req.params.id).populate('options');
        if (!question) {
            return res.status(404).json({ message: 'Тест табылмады' });
        }
        res.json(question);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Тестті жүктеу кезіндегі қате'});
    }
};



export const remove = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Тест табылмады' });
        }
        await Option.deleteMany({ _id: { $in: deletedQuestion.options } });

        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Өшіру орындалмады'});
    }
};

export const update = async (req, res) => {
    try {
        const { text, key, options } = req.body;

        const updatedOptions = await OptionModel.create(options);
        const updatedQuestion = await QuestionModel.findByIdAndUpdate(
            req.params.id,
            {
                text,
                key,
                options: updatedOptions.map(option => option._id),
            },
            { new: true }
        ).populate('options');

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Тест табылмады' });
        }
        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Тестті өңдеу кезіндегі қате'});
    }
}
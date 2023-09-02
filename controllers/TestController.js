import TestModel from "../models/Test.js";

export const getQuiz = async (req, res) => {
    try {
        res.json(await TestModel.aggregate([
            { $match: {collectionName: req.params.collectionName}},
            { $sample: {size: Math.min(parseInt(req.params.count), await TestModel.countDocuments({collectionName: req.params.collectionName}))}},
            { $project: { 
                _id: 1, 
                text: 1, 
                options: {
                    _id: 1,
                    text: 1
                }
            } }
        ]));
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'error', message: 'Тесттерді жүктеу кезіндегі қате'});
    }
};

export const getCollection = async (req, res) => {
    try {
        res.json(await TestModel.find({ collectionName: req.params.collectionName }));
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'error', message: 'Тесттерді жүктеу кезіндегі қате'});
    }
};

export const add = async (req, res) => {
    try {
        res.json(await TestModel.create(req.body));
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'error', message: 'Тесттерді сақтау кезіндегі қате'});
    }
};

export const update = async (req, res) => {
    try {
        if (!await Test.findByIdAndUpdate(req.params.id, req.body, { new: true }))
            return res.status(404).json({status: 'error', message: 'Тест табылмады' });
        res.json({status: 'success', message: 'Тест сәтті өңделді'});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'error', message: 'Тестті өңдеу кезіндегі қате'});
    }
}

export const remove = async (req, res) => {
    try {
        if (!await OptionModel.findByIdAndDelete(req.params.id))
            return res.status(404).json({status: 'error', message: 'Тест табылмады' });
        res.json({success: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'error', message: 'Өшіру орындалмады'});
    }
};

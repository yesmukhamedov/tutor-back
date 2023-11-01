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
        res.status(500).json({status: {type: 'error', message: 'Жүктеу орындалмады', description: 'Тесттерді жүктеу кезіндегі қате'}});
    }
};

export const getCollection = async (req, res) => {
    try {
        res.json(await TestModel.find({ collectionName: req.params.collectionName }).sort({ updatedAt: -1 }));
    } catch (err) {
        console.log(err);
        res.status(500).json({status: {type: 'error', message: 'Жүктеу орындалмады', description: 'Тесттерді жүктеу кезіндегі қате'}});
    }
};

export const add = async (req, res) => {
    try {
        await TestModel.create(req.body)
        res.json({status: {type: 'success', message: 'Сәтті орындалды', description: 'Тест сәтті сақталды'}});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: {type: 'error', message: 'Сақтау орындалмады', description: 'Тесттерді сақтау кезіндегі қате'}});
    }
};

export const update = async (req, res) => {
    try {
        if (!await TestModel.findByIdAndUpdate(req.params.id, req.body, { new: true }))
            return res.status(404).json({status: {type: 'error', message: 'Тест табылмады', description: 'Тест табылмады id: '+req.params.id}});
        res.json({status: {type: 'success', message: 'Сәтті орындалды', description: 'Тест сәтті өңделді'}});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: {type: 'error', message: 'Өңдеу орындалмады', description: 'Тестті өңдеу кезіндегі қате'}});
    }
}

export const remove = async (req, res) => {
    try {
        if (!await TestModel.findByIdAndDelete(req.params.id))
            return res.status(404).json({status: {type: 'error', message: 'Тест табылмады', description: 'Тест табылмады id: '+req.params.id}});
        res.json({status: {type: 'success', message: 'Сәтті орындалды', description: 'Тест сәтті өшірілді'}});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: {type: 'error', message: 'Өшіру орындалмады', description: 'Тестті өшіру кезіндегі қате'}});
    }
};

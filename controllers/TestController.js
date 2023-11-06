import TestModel from "../models/Test.js";
import Progress from "../models/Progress.js";

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const updateRecords = async () => {
  try {
    // Находим все документы в коллекции
    const documents = await TestModel.find();

    let updatedCount = 0;

    // Перебираем документы
    for (const doc of documents) {
      let hasUpdates = false;

      // Перебираем объекты options внутри документа
      for (const option of doc.options) {
        if (option._id === null) {
          option._id = new ObjectId();
          hasUpdates = true;
        }
      }

      // Если были обновления, сохраняем документ
      if (hasUpdates) {
        await doc.save();
        updatedCount++;
      }
    }

    console.log(`Обновлено ${updatedCount} записей`);
  } catch (error) {
    console.error(error);
  }
};

export const getQuiz = async (req, res) => {
  updateRecords();
  try {
    res.json(
      await TestModel.aggregate([
        { $match: { collectionName: req.params.collectionName } },
        {
          $sample: {
            size: Math.min(
              parseInt(req.params.count),
              await TestModel.countDocuments({
                collectionName: req.params.collectionName,
              })
            ),
          },
        },
        {
          $project: {
            _id: 1,
            text: 1,
            options: {
              _id: 1,
              text: 1,
            },
          },
        },
      ])
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: {
        type: "error",
        message: "Жүктеу орындалмады",
        description: "Тесттерді жүктеу кезіндегі қате",
      },
    });
  }
};

export const getCollection = async (req, res) => {
  try {
    res.json(
      await TestModel.find({ collectionName: req.params.collectionName }).sort({
        updatedAt: -1,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: {
        type: "error",
        message: "Жүктеу орындалмады",
        description: "Тесттерді жүктеу кезіндегі қате",
      },
    });
  }
};

export const checking = async (req, res) => {
  try {
    const { collectionName, questions } = req.body;

    const testResults = [];
    const results = [];

      for (const questionData of questions) {
        const { _id, ans } = questionData;
        const question = await TestModel.findById(_id);

        if (!question) {
          return res.status(400).json({
            status: {
              type: "error",
              message: "Қате",
              description: "Ұсынылған жауаптардағы сұрақ _id қате",
            },
          });
        }

        testResults.push({
          _id,
          options: question?.options?.map((option) => ({
            _id: option._id,
            result: option.truth
              ? ans.includes(option.text)
              : !ans.includes(option.text),
          })),
        });
      }

      results.push({
        connectionName: collectionName,
        questions: testResults,
      });

    await Progress.create({ quiz: results });

    res.status(200).json({
      status: {
        type: "success",
        message: "Жауаптар сәтті тексерілді",
        description: "Нәтижелерді жеке парақшадан көре аласыз",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: {
        type: "error",
        message: "Тексеру орындалмады",
        description: "Тесттерді тексеру кезіндегі қате",
      },
    });
  }
};

export const add = async (req, res) => {
  try {
    await TestModel.create(req.body);
    res.json({
      status: {
        type: "success",
        message: "Сәтті орындалды",
        description: "Тест сәтті сақталды",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: {
        type: "error",
        message: "Сақтау орындалмады",
        description: "Тесттерді сақтау кезіндегі қате",
      },
    });
  }
};

export const update = async (req, res) => {
  try {
    if (
      !(await TestModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }))
    )
      return res.status(404).json({
        status: {
          type: "error",
          message: "Тест табылмады",
          description: "Тест табылмады id: " + req.params.id,
        },
      });
    res.json({
      status: {
        type: "success",
        message: "Сәтті орындалды",
        description: "Тест сәтті өңделді",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: {
        type: "error",
        message: "Өңдеу орындалмады",
        description: "Тестті өңдеу кезіндегі қате",
      },
    });
  }
};

export const remove = async (req, res) => {
  try {
    if (!(await TestModel.findByIdAndDelete(req.params.id)))
      return res.status(404).json({
        status: {
          type: "error",
          message: "Тест табылмады",
          description: "Тест табылмады id: " + req.params.id,
        },
      });
    res.json({
      status: {
        type: "success",
        message: "Сәтті орындалды",
        description: "Тест сәтті өшірілді",
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: {
        type: "error",
        message: "Өшіру орындалмады",
        description: "Тестті өшіру кезіндегі қате",
      },
    });
  }
};

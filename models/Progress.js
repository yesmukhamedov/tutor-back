import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  quiz: {
    type: [
      {
        connectionName: {
          type: String,
          required: true,
        },
        questions: {
          type: [
            {
              _id: {
                type: String,
                required: true,
              },
              options: {
                type: [
                  {
                    _id: {
                      type: String,
                      required: true,
                    },
                    result: {
                      type: Boolean,
                      default: false,
                    },
                  },
                ],
                default: false,
              },
            },
          ],
          default: false,
        },
      },
    ],
    required: true,
  },
});

export default mongoose.model("Progress", ProgressSchema);

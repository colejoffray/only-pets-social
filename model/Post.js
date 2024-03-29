const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    image: {
      type: String,
      require: true,
    },
    cloudinaryId: {
      type: String,
      require: true,
    },
    caption: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: 'String'
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        userName: {
          type: 'String'
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false
    },
  });
  
  module.exports = mongoose.model("Post", PostSchema);
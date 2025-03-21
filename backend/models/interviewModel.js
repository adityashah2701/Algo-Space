// models/Interview.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const interviewSchema = new Schema({
  candidate: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  interviewer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  confirmedDate: {
    type: Date
  },
  confirmedTime: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  topics: {
    type: [String],
    default: []
  },
  meetingLink: {
    type: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    strengths: [String],
    areasToImprove: [String],
    notes: String,
    recommendationLevel: {
      type: String,
      enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no']
    }
  },
  cancellationReason: {
    type: String
  }
}, {
  timestamps: true
});

const Interview = model("Interview", interviewSchema);

export default Interview;
import mongoose, { Schema } from 'mongoose';

const EnvsSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  zoom: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

EnvsSchema.index({ uid: 1 }, { unique: true });

export default mongoose.model('envs', EnvsSchema);

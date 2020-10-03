import mongoose, { Schema } from 'mongoose';

const AppsSchema = new Schema({
  components: {
    type: Object,
    required: true,
    default: {}
  },
  links: {
    type: Object,
    required: true,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model('apps', AppsSchema);

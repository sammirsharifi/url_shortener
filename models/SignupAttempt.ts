import mongoose from 'mongoose'

const SignupAttemptSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id missing']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  password: {
    type: String,
    required: [true, "Please provide the password"]
  },
  createdAt: {
    type: Date,
    expires: '1h',
    default: Date.now,
    required: [true]
  }
})

export default mongoose.models.SignupAttempt || mongoose.model('SignupAttempt', SignupAttemptSchema)

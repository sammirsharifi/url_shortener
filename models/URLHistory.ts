import mongoose from 'mongoose'

const URLHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  longURL: {
    type: String,
    required: [true, "Please provide the long url"]
  },
  shortURL: {
    type: String,
    require: [true, 'Please provide the short url']
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.URLHistory || mongoose.model('URLHistory', URLHistorySchema)

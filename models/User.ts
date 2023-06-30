import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please provide a username.'],
		maxlength: [60, 'Name cannot be more than 60 characters']
	},
	password: {
		type: String,
		required: [true, "Please provide the user's password"]
	}
})

export default mongoose.models.User || mongoose.model('User', UserSchema)

// File: backend/models/BugModel.js
import mongoose from 'mongoose';

const BugSchema = new mongoose.Schema({
    githubIssueId: {
        type: Number,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    title: {
        type: String,
        required: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This is the key: it links the bug to a user in the 'User' collection
        required: true
    },
    website: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website', // Link to the WebsiteModel
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bug = mongoose.model('Bug', BugSchema);
export default Bug;
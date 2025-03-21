import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: true,
        trim: true
    },
    jobs:[{
        title:{
            type: String,
            required: true,
            trim: true
        },

    }],
    interviewer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    candidateApplied:[{
        candidateId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            
        },
        appliedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
            default: 'Applied'
        }
    }]

},{
    timestamps: true
    
})


export const Job = mongoose.model('Job',jobSchema)
import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
   
    name: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require: true
    },
    isDeleted: {
     type:Boolean,
     default:false
    }
}, { timestamps: true })




export default mongoose.model('Category', categorySchema)
import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    isDeleted: {
        type:Boolean,
        default:false
       }
}, { timestamps: true })


export default mongoose.model('Product', productSchema)
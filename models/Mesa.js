const mongoose = require("mongoose");
const Schema = mongoose.Schema
const MesaSchema = new Schema({
    numero:{
        type: Number,
        required: true
    },
    qrCode:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        required: true,
        default: 0 
    },
    restaurante:{
        type: Schema.Types.ObjectId,
        ref: "restaurantes",
        required:true
    }
})
mongoose.model("mesas",MesaSchema)
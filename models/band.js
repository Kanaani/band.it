const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BandSchema = new Schema({
   id:{
       type: Number
   },
   name:{
       type: String,
       required: [true, 'Name field required']
   },
    genre:{
       type: String,
        required: [true, 'Genre field required']
    },
    bio:{
        type: String,
        required: [true, 'Bio field required']
    },
    rating:{
       type: Number
    },
    img:{
       type: String
    }

});

let Band = module.exports = mongoose.model('band', BandSchema);
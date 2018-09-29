// UNUSED

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
   id:{
       type: Number
   },
   title:{
       type: String,
       required: [true, 'Title field required']
   },
    date:{
       type: String,
        required: [true, 'Date field required']
    },
    summary:{
        type: String,
        required: [true, 'Summary field required']
    },
    article:{
       type: String
    }
});

let News = module.exports = mongoose.model('news', NewsSchema);
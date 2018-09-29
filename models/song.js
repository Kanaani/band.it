const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
   id:{
       type: Number
   },
   title:{
       type: String,
       required: [true, 'Title field required']
   },
    path:{
       type: String,
        required: [true, 'Path field required']
    },
    bandName:{
       type: String,
       required: [true, 'bandName field required']
    }

});

let Song = module.exports = mongoose.model('song', SongSchema);
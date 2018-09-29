const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticlesSchema = new Schema({
   title:{
       type: String,
   },
    date:{
       type: String,
    },
    summary:{
        type: String,
    },
    path:{
       type: String
    }
});

let Articles = module.exports = mongoose.model('articles', ArticlesSchema);
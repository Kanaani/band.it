const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
var upload = require('express-fileupload');

mongoose.connect('mongodb://localhost/Bandb');
let db = mongoose.connection;

db.once('open', function(){
    console.log('Connected to MongoDB');
});

db.on('error', function(err){
    console.log('DB error')
});

var logged = false;
const app = express();

app.use(upload());
app.use(express.static(__dirname + '/public'));

let Band = require('./models/band');
let Song = require('./models/song');
// let NewsObj = require('./models/news');
let Article = require('./models/article');

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended : false}));

app.use(bodyParser.json());

mongoose.model('bands', {});
mongoose.model('songs', {});

app.get('/bands', function(req, res){
    mongoose.model('bands').find(function(err, bands){
        res.send(bands);
    });
});

app.get('/news', function(req, res){
    console.log("getting news")
    Article.find(function(err, news){
        res.send(news);
    });
});

app.get('/songs', function(req, res){
    mongoose.model('songs').find(function(err, songs){
        res.send(songs);
    });
});

app.get('/public', function(req, res){

});


app.get('/', function(req, res){
    Band.find({}, function(err, bands){
        if(err){
            console.log(err);
        } else {
                res.render('index', { title: 'Bands',
                bands: bands
            });

        }
    });
});

app.get('/admin',function(req,res){
    if(logged)
        res.render('admin');
    else
        res.redirect('/login');
})

app.get('/login',function(req,res){
    res.sendFile(__dirname+'/views/login.html');
})

app.get('/bands/add', function(req, res){
    res.render('add band',{
        title:'Add Band'
    });
});

app.post('/admin/bands/insert', function(req, res){
    let band = new Band();
    band.name = req.body.name;
    band.bio = req.body.bio;
    band.genre = req.body.genre;
    band.img = req.body.img;
    band.rating = req.body.rating;

    band.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            console.log("Band added successfully")
            res.redirect('/admin');
        }
    });
});

app.post('/admin/songs/insert', function(req, res){
    console.log("adding song")
    let song = new Song();
    song.title = req.body.title;
    song.path = req.body.path;
    song.bandName = req.body.bandName;

    song.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            console.log("Song added successfully")
            //res.render('admin');
        }
    });
});

app.post('/admin/news/insert', function(req, res){
    console.log("adding news")
    let news = new Article();
    news.title = req.body.title;
    news.date = req.body.date;
    news.summary = req.body.summary;
    news.path = req.body.path;

    news.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            console.log("News added successfully")
            res.redirect('/admin');
        }
    });
});

app.post('/admin/remove', function(req, res){
    console.log("deleting")

    let id = req.body.id
    let t = req.body.type
    console.log('t= '+t+', id= '+id)
    let obj = Band
    switch(t){
        case 1: obj = Song; break;
        case 2: // delete slideshow
            fs.unlink('./public/res/images/slideshow/'+id+'.jpg', (err) => {
                if (err) throw err;
                return console.log('cover '+id+' was deleted');
            });
            return;
        case 3: obj = Article; break;
    }
    obj.findById(id, function(err, b){
        if(b._id != id){
            res.status(500).send();
        } else {
            obj.remove(b, function(err){
                if(err){
                    console.log(err);
                }
                console.log(t+" deleted")
                //res.redirect('/admin');
            });
        }
    });
});

app.post('/bands/upload',function(req,res){
    console.log(req.files);
    if(req.files.upfile){
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/public/res/images/bandcover/' + name;
        file.mv(uploadpath,function(err){
            if(err){
                console.log("File Upload Failed",name,err);
                res.send("Error Occured!")
            }
            else {
                res.redirect('/admin');
            }
        });
    }
    else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/songs/upload',function(req,res){
    console.log("uploading song");
    console.log(req.files);
    if(req.files.upfile){
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/public/res/songs/' + name;
        file.mv(uploadpath,function(err){
            if(err){
                console.log("File Upload Failed",name,err);
                res.send("Error Occured!")
            }
            else {
                console.log("Song uploaded");
                res.redirect('/admin');
            }
        });
    }
    else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/news/upload',function(req,res){
    console.log("uploading article")
    console.log(req.files);
    if(req.files.upfile){
        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/public/res/news/' + name;
        file.mv(uploadpath,function(err){
            if(err){
                console.log("File Upload Failed",name,err);
                res.send("Error Occured!")
            }
            else {
                res.redirect('/admin');
            }
        });
    }
    else {
        res.send("No File selected !");
        res.end();
    };
})

app.post('/login',function(req,res){
    console.log("checking admin password")
    if(req.body.pass == "1"){
        logged = true;
        res.redirect('/admin');
    }
    else{
        console.log("password is incorrect")
        res.send("Wrong Password");
    }
})

app.get('/logout', function(req, res){
    logged = false;
    console.log("logged out")
    res.redirect('/admin');
});

app.listen(3000, function(){
    console.log('server started on port 3000..')
});

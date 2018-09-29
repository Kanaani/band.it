window.onload = function () {
    loadBands();
    loadNews();
    loadSlideshow();
    loadSongs();
}

function loadSlideshow(){
    var img = document.getElementsByClassName("mySlides")
    for (i = 0; i < img.length; i++) {
        img[i].src = "../res/images/slideshow/"+(i+1)+".jpg"
    }
}

var slideIndex = 0;
showDivs(slideIndex);

function plusDivs(n) {
    changeDivs(slideIndex += n);
}

function currentDiv(n) {
    changeDivs(slideIndex = n);
}

function showDivs(n, f) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("bullet");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" sh-white", "");
    }
    slideIndex++;
    if (slideIndex > x.length) {
        slideIndex = 1
    }
    x[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " sh-white";
    setTimeout(showDivs, 10000);
}

function changeDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("bullet");
    if (n > x.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = x.length
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" sh-white", "");
    }
    x[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " sh-white";
}

function loadBands() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var bandsJson = JSON.parse(this.responseText);
            var j;
            for (j = bandsJson.length - 1; j >= 0; j--) {
                i = bandsJson.length - 1 - j;
                document.getElementById("bandsCol").innerHTML += '\
                <a class="bandsRes">\
                <div class="thecard">\
                    <div class="card-img">\
                        <img src="../res/images/bandcover/' + bandsJson[i].img + '">\
                    </div>\
                    <div class="card-caption">\
                        <span class="genre">' + bandsJson[i].genre + '</span>\
                        <h1>' + bandsJson[i].name + '</h1>\
                        <p>Rating: ' + bandsJson[i].rating + '</p>\
                    </div>\
                    <div class="card-outmore">\
                        <button class="collapsible" onclick="showSongs(\'' + bandsJson[i]._id + '\',\''+bandsJson[i].name+'\')">Songs</button>\
                        <div class="content" id="cntBand' + bandsJson[i]._id + '">\
                            <ul id="songsList' + bandsJson[i]._id + '">\
                            </ul>\
                        </div>\
                    </div>\
                </div>\
                </a>';
            }

        }
    };
    xmlhttp.open("GET", "/bands", true);
    xmlhttp.send();
}

var audio;
var isPlaying = false;
var songsJson
function loadSongs() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/songs", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            songsJson = JSON.parse(this.responseText);
        }
    };
    xmlhttp.send();
}

function showSongs(id,name) {
    var c = document.getElementById("cntBand" + id);
    if (c.style.display === "block") {
        c.style.display = "none";
    } else {
        c.style.display = "block";
    }
    var p = document.getElementById("songsList" + id);
    p.innerHTML = '';
    for (i = 0; i < songsJson.length; i++) {
        if(songsJson[i].bandName == name){
            p.innerHTML += '\
            <li>\
                <img class="playIcon" id="play' + songsJson[i].path + '" \
                src="../res/images/icons-play.png" onclick="playSample(\'' + songsJson[i].path + '\')">\
                ' + songsJson[i].title + '\
            </li>';
        }
    }

}

function playSample(p) {
    var btn = document.getElementById("play" + p);
    if (isPlaying) {
        audio.pause()
        isPlaying = false
        btn.src = "res/images/icons-play.png";
    } else {
        audio = new Audio('res/songs/' + p);
        audio.play()
        isPlaying = true
        btn.src = "res/images/icons-pause.png";
        audio.onended = function () {
            audio.remove()
        };
    }
}

function pauseAudio() {
    audio.pause()
    isPlaying = false
}

function loadNews() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var newsJson = JSON.parse(this.responseText);
            var j;
            for (j = newsJson.length - 1; j >= 0; j--) {
                i = newsJson.length - 1 - j;
                document.getElementById("newsCol").innerHTML += '\
                <a class="newsRes">\
                    <div class="NewsCard">\
                        <div class="card-caption">\
                            <span class="date">' + newsJson[i].date + '</span>\
                            <h1>' + newsJson[i].title + '</h1>\
                            <p>' + newsJson[i].summary + '</p>\
                        </div>\
                        <div class="card-outmore">\
                            <button class="collapsible newsShowBtn" onclick="toggleNews(' + i + ')">show more</button>\
                            <div class="content" id="cntnNews' + i + '">\
                                <p><embed src="../res/news/' + newsJson[i].path + '"></p>\
                            </div>\
                        </div>\
                    </div>\
                </a>';
            }

        }
    };
    xmlhttp.open("GET", "/news", true);
    xmlhttp.send();
}

function srchFilter(){
    var input, filter, col, card, title, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    // filter bands
    col = document.getElementById("bandsCol");
    card = col.getElementsByClassName("bandsRes");
    for (i = 0; i < card.length; i++) {
        title = card[i].getElementsByTagName("h1")[0];
        if (title.innerHTML.toUpperCase().indexOf(filter) > -1) {
            card[i].style.display = "";
        } else {
            card[i].style.display = "none";
        }
    }
    // filter news
    col = document.getElementById("newsCol");
    card = col.getElementsByClassName("newsRes");
    for (i = 0; i < card.length; i++) {
        title = card[i].getElementsByTagName("h1")[0];
        if (title.innerHTML.toUpperCase().indexOf(filter) > -1) {
            card[i].style.display = "";
        } else {
            card[i].style.display = "none";
        }
    }
}

/* function loadCollaps(){
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
} */

btn = document.getElementsByClassName("newsShowBtn");

function toggleNews(n) {
    var c = document.getElementById("cntnNews" + n);
    if (c.style.display === "block") {
        btn[n].innerHTML = 'Show more';
        c.style.display = "none";
    } else {
        btn[n].innerHTML = 'Show Less';
        c.style.display = "block";
    }
}

function genreFilter(g){
    var col, card, title, i;
    col = document.getElementById("bandsCol");
    card = col.getElementsByClassName("bandsRes");
    if(g=='all'){
        for (i = 0; i < card.length; i++) {
            card[i].style.display = "";
        }
    } else
    for (i = 0; i < card.length; i++) {
        title = card[i].getElementsByTagName("span")[0];
        if (title.innerHTML.indexOf(g) > -1) {
            card[i].style.display = "";
        } else {
            card[i].style.display = "none";
        }
    }
}

function showCol(n) {
    var col0 = document.getElementById("bandsCol");
    var col1 = document.getElementById("newsCol");
    if(n==0) {
        col0.style.display = "block";
        col1.style.display = "none";
    } else {
        col1.style.display = "block";
        col0.style.display = "none";
    }
}
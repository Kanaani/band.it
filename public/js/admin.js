window.onload = function () {
    let n = 0;
    if (sessionStorage.getItem("panel") === null) {
        sessionStorage.setItem("panel","0");
    } else {
        n = Number(sessionStorage.getItem("panel"))
    }
    showTable(n);
    // setTimeout(function() { showTable(n); }, 500);
}

var bandsJson;
var xmlhttp = new XMLHttpRequest();
    
        

function showTable(n) {
    sessionStorage.setItem("panel", n)
    var i;
    var x = document.getElementsByClassName("adminCtr");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[n].style.display = "block";
    loadTable(n);    
}

function loadTable(n) {
    var xmlhttp = new XMLHttpRequest();

    switch (n) {
        case 0: // Bands
            document.getElementById("bandsTable").innerHTML = '';
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    bandsJson = JSON.parse(this.responseText);
                    for (i = 0; i < bandsJson.length; i++) {
                        document.getElementById("bandsTable").innerHTML += '\
                    <tr>\
                        <td><div class="cover">\
                            <img src="res/images/bandcover/' + bandsJson[i].img + '" alt="cover" style="width: 60px">\
                        </div>\</td>\
                        <td>' + (i+1) + '</td>\
                        <td>' + bandsJson[i].name + '</td>\
                        <td>' + bandsJson[i].genre + '</td>\
                        <td>' + bandsJson[i].rating + '</td>\
                        <td><input type="submit" class="remove" value="Remove"\
                        onclick="removeElmnt(' + n + ',\'' + bandsJson[i]._id + '\')"></td>\
                    </tr>';
                    }
                }
            };
            xmlhttp.open("GET", "/bands", true);
            xmlhttp.send();
            break;

        case 1: // Songs
            document.getElementById("songsTable").innerHTML = '';
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var songsJson = JSON.parse(this.responseText);
                    for (i = 0; i < songsJson.length; i++) {
                        document.getElementById("songsTable").innerHTML += '\
                    <tr>\
                        <td>' + (i+1) + '</td>\
                        <td>' + songsJson[i].title + '</td>\
                        <td>' + songsJson[i].bandName + '</td>\
                        <td><input type="submit" class="remove" value="Remove"\
                         onclick="removeElmnt(' + n + ',\'' + songsJson[i]._id + '\')"></td>\
                    </tr>';
                    }

                }
            };
            xmlhttp.open("GET", "/songs", true);
            xmlhttp.send();

            if(bandsJson == null){
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        bandsJson = JSON.parse(this.responseText);
                        document.getElementById("songBandForm").innerHTML='';
                        for(i = 0; i < bandsJson.length; i++){
                            var opt = document.createElement("option");
                            opt.value = bandsJson[i].name;
                            opt.innerHTML = bandsJson[i].name;
                            document.getElementById("songBandForm").appendChild(opt);
                        }
                    }
                };
                xmlhttp.open("GET", "/bands", true);
                xmlhttp.send();
            }
            break;

        case 2: // Events
            document.getElementById("eventsTable").innerHTML = '';
            for (i = 1; i < 5; i++) {
                document.getElementById("eventsTable").innerHTML += '\
            <tr>\
                <td>' + i + '</td>\
                <td><div class="cover">\
                    <img src="res/images/slideshow/'+i+'.jpg" alt="please upload banner # '+i+'" style="width: 100%; ">\
                </div>\</td>\
                <td><input type="submit" class="remove" value="Remove"\
                onclick="removeElmnt(' + n + ',\'' + i + '\')"></td>\
            </tr>';
            }
            break;

        case 3: // News
            document.getElementById("newsTable").innerHTML = '';
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var newsJson = JSON.parse(this.responseText);
                    for (i = 0; i < newsJson.length; i++) {
                        document.getElementById("newsTable").innerHTML += '\
                    <tr>\
                        <td>' + (i+1) + '</td>\
                        <td>' + newsJson[i].title + '</td>\
                        <td>' + newsJson[i].date + '</td>\
                        <td><input type="submit" class="remove" value="Remove"\
                         onclick="removeElmnt(' + n + ',\'' + newsJson[i]._id + '\')"></td>\
                    </tr>';
                    }
                }
            };
            xmlhttp.open("GET", "/news", true);
            xmlhttp.send();
            break;

    }
}

function removeElmnt(t, id) {
    let itemID = { "id" : id, "type" : t}
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/admin/remove", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            console.log(resp);
        }
    };
    var data = JSON.stringify(itemID);
    xmlhttp.send(data);
    location.reload();
}

function logoutAdmin() {
    // TODO
}

document.getElementById("submtBtnBand").addEventListener("click", function () {
    var newBand = {
        "name": document.getElementById("bandNameForm").value,
        "img": document.getElementById("bandCoverForm").value.split(/(\\|\/)/g).pop(),
        "bio": document.getElementById("bandBioForm").value,
        "rating": document.getElementById("bandRatingForm").value,
        "genre": document.getElementById("bandGenreForm").value
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/admin/bands/insert", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Band Added");
        }
    };
    var data = JSON.stringify(newBand);
    xmlhttp.send(data);
});

document.getElementById("submtBtnSong").addEventListener("click", function () {
    var newSong = {
        "title": document.getElementById("songNameForm").value,
        "path": document.getElementById("songPathForm").value.split(/(\\|\/)/g).pop(),
        "bandName": document.getElementById("songBandForm").value
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/admin/songs/insert", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            console.log(resp);
        }
    };
    var data = JSON.stringify(newSong);
    xmlhttp.send(data);
});

document.getElementById("submtBtnNews").addEventListener("click", function () {
    var newArticle = {
        "title": document.getElementById("newsNameForm").value,
        "date": document.getElementById("newsDateForm").value,
        "summary": document.getElementById("newsSumForm").value,
        "path": document.getElementById("newsPathForm").value.split(/(\\|\/)/g).pop(),
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/admin/news/insert", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            console.log(resp);
        }
    };
    var data = JSON.stringify(newArticle);
    xmlhttp.send(data);
});
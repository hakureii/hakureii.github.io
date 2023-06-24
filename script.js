// This code should only be modified by an expert, it will be easy to read tho.
// script fully made by tanos n a little help with openai!

console.log("code doesnt work on a live server either (::5500) it must be on a real server (https://test.com/)")

var global_note = "Game note will be displayed here."

const currentTimeElement = document.getElementById('current-time');

var searchIndex = 0;
var searchText = "";
var paragraphs = document.getElementsByTagName("p");

$("#spinImage").click(function () {
    $(this).css({
        "animation": "spin 1.5s ease-in-out",
        "animation-iteration-count": "1"
    });
});

Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

function create_card(game, image, validation, note) {
    global_note = note;
    validation = validation.toLowerCase();

    if (validation == "working" || validation == "perfect")
        validation = "valid";
    if (validation == "boot" || validation == "booting")
        validation = "ig";
    if (validation == "ingame" || validation == "in-game")
        validation = "y";
    if (validation == "nothing" || validation == "null")
        validation = "invalid";

    if (note == "null")
        note = "No notes given."

    note = note.capitalize();
    game = game.capitalize();

    var cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.style = `background-image: url("${image}");`;
    cardDiv.onmouseenter = function () {
        showStatus(game + ": " + note);
    };
    cardDiv.onclick = function () {
        showStatus(game + ": " + note);
    };

    var containerDiv = document.createElement('div');
    containerDiv.className = 'container';

    var indi = document.createElement('div');
    indi.className = "indicator " + validation;

    containerDiv.appendChild(indi);

    cardDiv.appendChild(containerDiv);

    document.querySelector('.card-container').appendChild(cardDiv);
}
// ! Only use for debugging !
/*
create_card("Celeste", "https://th.bing.com/th/id/OIP.5GA1Yp5ZK1-lOIYpRjTPjwHaHa?pid=ImgDet&rs=1", "Working", "Plays fine");
create_card("Celeste", "https://th.bing.com/th/id/OIP.5GA1Yp5ZK1-lOIYpRjTPjwHaHa?pid=ImgDet&rs=1", "Not working", "Graphical issues");
create_card("Celeste", "https://th.bing.com/th/id/OIP.5GA1Yp5ZK1-lOIYpRjTPjwHaHa?pid=ImgDet&rs=1", "0", "Unknown entry.");*/

function load_game_list() {
    // load device
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        console.log("smooth scroll enabled for tablet")
        document.getElementsByTagName("body")[0].style.scrollBehavior = "smooth";
    }
    if (
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
            ua
        )
    ) {
        console.log("mobile/small device detected, smooth scroll diasbled")
    } else {
        console.log("smooth scroll enabled for PC")
        document.getElementsByTagName("body")[0].style.scrollBehavior = "smooth";
    }

    // load list
    var xhr = new XMLHttpRequest();
    var file = 'games.json';
    xhr.open('GET', file, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status === 200) {
            var jsonData = xhr.response;

            jsonData.wumbee.sort(function (a, b) {
                var nameA = a.game.toLowerCase(), nameB = b.game.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)
            });

            jsonData.unofficial.sort(function (a, b) {
                var nameA = a.game.toLowerCase(), nameB = b.game.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)
            });

            jsonData.homebrew.sort(function (a, b) {
                var nameA = a.game.toLowerCase(), nameB = b.game.toLowerCase()
                if (nameA < nameB) //sort string ascending
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 //default return value (no sorting)
            });

            console.log(jsonData);

        } else {
            console.error('Error loading the file. Status:', xhr.status);
        }
    };

    xhr.onerror = function () {
        showStatus("Hosted on ::1, using outdated JSON")
        console.log('games.json not found or is hosted locally, publish to server and it should work; using backup json..');

        var data = JSON.parse(outdated_backupJSON);

        function sortByGame(arr) {
            arr.sort(function (a, b) {
                var nameA = a.game.toLowerCase(), nameB = b.game.toLowerCase()
                if (nameA < nameB)
                    return -1
                if (nameA > nameB)
                    return 1
                return 0
            });
            return arr;
        }

        const wumbeeGames = sortByGame(data.wumbee);
        wumbeeGames.forEach(game => {
            create_card(game.game, game.logo, game.status, game.note)
            console.log("Game:", game.game);
            console.log("Status:", game.status);
            console.log("Note:", game.note);
            console.log("Logo:", game.logo);
            console.log("Tester:", game.tester);
        });

        const unofficialGames = sortByGame(data.unofficial);
        unofficialGames.forEach(game => {
            create_card(game.game, game.logo, game.status, game.note)
            console.log("Game:", game.game);
            console.log("Status:", game.status);
            console.log("Note:", game.note);
            console.log("Logo:", game.logo);
            console.log("Tester:", game.tester);
        });

        const homebrewGames = sortByGame(data.homebrew);
        homebrewGames.forEach(game => {
            create_card(game.game, game.logo, game.status, game.note)
            console.log("Game:", game.game);
            console.log("Status:", game.status);
            console.log("Note:", game.note);
            console.log("Logo:", game.logo);
            console.log("Tester:", game.tester);
        });
    };

    xhr.send();

    const hideElements = document.querySelectorAll(".hideTillLoaded");
    hideElements.forEach((element) => {
        element.style.display = "none";
    });
}
load_game_list()

function search() {
    var input = document.getElementById("myInput");
    searchText = input.value.toLowerCase();
    searchIndex = 0;
    findNextMatch();
}

const ctrlr = document.querySelector('#pp');
const bb = document.querySelector('#four');
const sp = document.querySelector('#spinImage');

var darkmodeon = "f";

function cs() {
    localStorage.clear();
}

document.addEventListener("DOMContentLoaded", function () {
    // load hash
    var hash = window.location.hash
    hash = hash.substring(1);
    if (hash.includes("settings")) {
        console.log("hash includes settings");

        if (hash.includes("settings?")) {
            console.log("hash changed pages");

            gg(); // open settings
            SwitchTo(hash.replace("settings?", ""), "false") // settings page
        }
    } else {
        console.log("hash is empty or unknown")
        window.location.href = "#";
    }

    // load style
    var dim = localStorage.getItem("darkmode");
    if (dim == "dark") { // dark toggled
        darkMode("ncheck", "true")
    }
});

function dCheck() {
    var dim = localStorage.getItem("darkmode");

    if (dim === "dark") {
        localStorage.setItem("darkmode", "light");
    } else if (dim === "light") {
        localStorage.setItem("darkmode", "dark");
    } else {
        localStorage.setItem("darkmode", "dark");
    }
}

function darkMode(check, silent) {
    if (check === "set") {
        dCheck();
    }

    const darkbg = '#333333';
    const darkclr = '#e5e5e5';

    document.getElementsByTagName('body')[0].style.backgroundColor = darkbg;
    document.querySelectorAll('.bottom-bar')[0].style.backgroundColor = darkbg;
    document.getElementsByTagName('body')[0].style.color = darkclr;
    document.getElementsByTagName('button')[0].style.color = darkclr;
    document.getElementsByTagName('h4')[0].style.color = "#fff";
    document.getElementsByTagName('h5')[0].style.color = "#fff";
    document.querySelectorAll('.settogs')[0].style.color = darkclr;

    const menuItems = document.querySelectorAll('.menu-items');
    menuItems.forEach(item => {
        item.style.color = darkclr;
    });

    ctrlr.src = "Controller/White/Pro Controller.png";

    bb.src = "https://cdn.discordapp.com/attachments/1121502360032788612/1122199932305154179/4444444.png"
    sp.src = "https://cdn.discordapp.com/attachments/1105607582560829511/1122202253848232107/strato-logo.png"

    if (localStorage.getItem("darkmode") === "dark") {
        darkmodeon = "t";

        document.getElementById('sts').classList.remove('selectedd');
        document.getElementById('sts').classList.remove('selectedl');

        SwitchTo("sts", silent);
    } else {
        darkmodeon = "f";
        window.location.reload();
    }
}

function SwitchTo(str, silent) {
    if (silent == "false") {
        window.location.href = `#settings?${str}`
    }

    var test = document.querySelector(".test")
    var settings = document.querySelector(".settings")
    var friends = document.querySelector(".friends")
    var credits = document.querySelector(".credits")

    test.style.display = "none";
    settings.style.display = "none";
    friends.style.display = "none";
    credits.style.display = "none";

    document.getElementById('sts').classList.remove('selectedd');
    document.getElementById('frs').classList.remove('selectedd');
    document.getElementById('crs').classList.remove('selectedd');
    document.getElementById('tst').classList.remove('selectedd');

    document.getElementById('sts').classList.remove('selectedl');
    document.getElementById('frs').classList.remove('selectedl');
    document.getElementById('crs').classList.remove('selectedl');
    document.getElementById('tst').classList.remove('selectedl');

    if (darkmodeon != "f") { // dark
        document.getElementById(`${str}`).classList.add('selectedd');
    } else { // light
        document.getElementById(`${str}`).classList.add('selectedl');
    }

    if (str == "sts")
        settings.style.display = "block";
    if (str == "frs")
        friends.style.display = "block";
    if (str == "crs")
        credits.style.display = "block";
    if (str == "tst")
        test.style.display = "block";
}

var g = "g"
var last_page = ""

function gg() {
    const img = document.querySelector('#four');
    if (g != "g") {
        var hash = window.location.hash
        hash = hash.substring(1);
        last_page = hash

        window.location.href = "#"
        console.log('g')
        g = "g"
        $("#support").animate({
            opacity: "0"
        }, 200);
        setTimeout(function () {
            document.getElementById("support").style.display = "none"
            document.getElementById("card-container").style.display = "flex"
            $("#card-container").animate({
                opacity: "1"
            }, 200);
        }, 200);
        img.style.width = "80px"
        img.src = 'https://cdn.discordapp.com/attachments/937459410081550386/1121136827840077914/image.png';
        // window.location.reload();
    } else if (g != "x") {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            console.log("settings loaded fine")
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            alert(
                "Your device may be too small to render this page, proceed with caution."
            )
        } else {
            console.log("settings loaded fine")
        }
        console.log('x')
        g = "x"
        $("#card-container").animate({
            opacity: "0"
        }, 200);
        if (last_page == "undefined" || last_page == "#" || last_page == "#settings" || last_page == "" || last_page == "settings") {
            window.location.href = "#settings"
        } else {
            window.location.href = `#${last_page}`
        }
        setTimeout(function () {
            document.getElementById("card-container").style.display = "none"
            document.getElementById("support").style.display = "flex"
            $("#support").animate({
                opacity: "1"
            }, 200);
            document.getElementById("zxx").innerHTML = "Settings may be bugged!"
        }, 200);

        img.style.width = "65px"
        img.src = 'https://cdn.discordapp.com/attachments/1121502360032788612/1121821431085404292/image.png';
    }
}

function findNextMatch() {
    clearHighlights();
    if (searchText !== "") {
        for (var i = searchIndex; i < paragraphs.length; i++) {
            var paragraphText = paragraphs[i].textContent.toLowerCase();
            var matchIndex = paragraphText.indexOf(searchText);
            if (matchIndex !== -1) {
                var matchedText = paragraphs[i].textContent.substring(matchIndex, matchIndex + searchText.length);
                var highlightedText = paragraphs[i].innerHTML.replace(
                    new RegExp(`\\b${matchedText} \\b`, "gi"),
                    "<span class='highlight'>$&</span>"
                );
                paragraphs[i].innerHTML = highlightedText;
                searchIndex = i + 1;
                paragraphs[i].scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
        }
    }
    searchIndex = 0;
}

function clearHighlights() {
    for (var i = 0; i < paragraphs.length; i++) {
        var highlightedText = paragraphs[i].innerHTML.replace(
            /<span class="highlight">|<\/span>/gi,
            ""
        );
        paragraphs[i].innerHTML = highlightedText;
    }
}

function getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} `;

    return formattedTime;
}

function updateTime() {
    const currentTime = getCurrentTime();
    currentTimeElement.textContent = currentTime;
}

updateTime();

setInterval(updateTime, 6000);

function showStatus(g) {
    document.getElementById("zxx").innerText = g
    $("#zxx").animate({
        opacity: "1"
    }, 500);
}

/*
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED THIS CODE SHOULD NOT BE TOUCHED 
*/
// this code below, its for mandetory backup incase browser old
var outdated_backupJSON = `{
    "wumbee": [
        {
            "game": "a short hike",
            "status": "playable",
            "note": "minor fps drops, may have some black textures after playing for a while",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/a_short_hike.png",
            "tester": "wumbee"
        },
        {
            "game": "astroneer",
            "status": "boot",
            "note": "plays garbled audio once then crashes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/astroneer.png",
            "tester": "wumbee"
        },
        {
            "game": "axiom verge",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/axiom_verge.png",
            "tester": "wumbee"
        },
        {
            "game": "axiom verge 2",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/axiom_verge_2.png",
            "tester": "wumbee"
        },
        {
            "game": "blossom tales",
            "status": "playable",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/blossom.png",
            "tester": "wumbee"
        },
        {
            "game": "botw",
            "status": "in-game",
            "note": "updated runs at 30 fps (only menu), gets stuck in the middle of loading saves, dots move. supposedly fixed on new versions.",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/botw.png",
            "tester": "wumbee"
        },
        {
            "game": "broforce",
            "status": "in-game",
            "note": "seizure graphics, bad fps update doesn't seem to do much",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/broforce.png",
            "tester": "wumbee"
        },
        {
            "game": "carrion",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/carrion.png",
            "tester": "wumbee"
        },
        {
            "game": "cat quest",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/cat_quest.png",
            "tester": "wumbee"
        },
        {
            "game": "cat quest 2",
            "status": "perfect",
            "note": "requires update",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/cat_quest_2.png",
            "tester": "wumbee"
        },
        {
            "game": "cave story",
            "status": "in-game",
            "note": "requires update, updated ver goes to menu before deadlock",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/cave_story.png",
            "tester": "wumbee"
        },
        {
            "game": "celeste",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/celeste.png",
            "tester": "wumbee"
        },
        {
            "game": "chicory: a colourful tale",
            "status": "playable",
            "note": "ignore lag on start screen",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/chicory.png",
            "tester": "wumbee"
        },
        {
            "game": "coffee talk",
            "status": "in-game",
            "note": "fps drops, flashing and glitching textures and artifacts",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/coffee_talk.png",
            "tester": "wumbee"
        },
        {
            "game": "crashlands",
            "status": "perfect",
            "note": "deadlocks in the cutscene without update, afterwards its perfect",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/crashlands.png",
            "tester": "wumbee"
        },
        {
            "game": "cult of the lamb",
            "status": "in-game",
            "note": "stutters. minor black textures",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/cult_of_the_lamb.png",
            "tester": "wumbee"
        },
        {
            "game": "cuphead",
            "status": "in-game",
            "note": "fps drops, missing/invisible textures",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/cuphead.png",
            "tester": "wumbee"
        },
        {
            "game": "dead cells",
            "status": "in-game",
            "note": "deadlocks at next area. update now works still has deadlocks",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/dead_cells.png",
            "tester": "wumbee"
        },
        {
            "game": "deltarune",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/deltarune.png",
            "tester": "wumbee"
        },
        {
            "game": "dont starve together",
            "status": "playable",
            "note": "dont turn on free guest texture mem, updating the game lower fps!",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/dont_starve_together.png",
            "tester": "wumbee"
        },
        {
            "game": "enter the gungeon",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/enter_the_gungeon.png",
            "tester": "wumbee"
        },
        {
            "game": "evil tonight",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/evil_tonight.png",
            "tester": "wumbee"
        },
        {
            "game": "exit the gungeon",
            "status": "in-game",
            "note": "deadlocks often, bad fps",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/exit_the_gungeon.png",
            "tester": "wumbee"
        },
        {
            "game": "fez",
            "status": "playable",
            "note": "save issues, has a workaround",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/fez.png",
            "tester": "wumbee"
        },
        {
            "game": "forager",
            "status": "perfect",
            "note": "update works perfectly too",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/forager.png",
            "tester": "wumbee"
        },
        {
            "game": "gato roboto",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/gato_roboto.png",
            "tester": "wumbee"
        },
        {
            "game": "golf story",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/golf_story.png",
            "tester": "wumbee"
        },
        {
            "game": "hades",
            "status": "in-game",
            "note": "fps drops, game blackscreens and dies if you die",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/hades.png",
            "tester": "wumbee"
        },
        {
            "game": "hollow knight",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/hollow_knight.png",
            "tester": "wumbee"
        },
        {
            "game": "hotline miami",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/hotline_miami.png",
            "tester": "wumbee"
        },
        {
            "game": "hyper light drifter",
            "status": "playable",
            "note": "weird green colour filter appears sometimes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/hyper_light_drifter.png",
            "tester": "wumbee"
        },
        {
            "game": "into the breach",
            "status": "in-game",
            "note": "broken text",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/into_the_breach.png",
            "tester": "wumbee"
        },
        {
            "game": "ittle dew",
            "status": "playable",
            "note": "some graphical glitches, light sources cause flashing",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/ittle_dew.png",
            "tester": "wumbee"
        },
        {
            "game": "ittle dew 2",
            "status": "playable",
            "note": "mild graphical glitches",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/ittle_dew_2.png",
            "tester": "wumbee"
        },
        {
            "game": "katana zero",
            "status": "perfect",
            "note": "may need update to fix textboxes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/katana_zero.png",
            "tester": "wumbee"
        },
        {
            "game": "kindergarten: buddy edition",
            "status": "playable",
            "note": "may have graphical glitches",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/kindergarten_buddy_edition.png",
            "tester": "wumbee"
        },
        {
            "game": "lil gator game",
            "status": "playable",
            "note": "some fps drops, mostly 50~60. some textures turn black",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/lil_gator.png",
            "tester": "wumbee"
        },
        {
            "game": "links awakening",
            "status": "playable",
            "note": "bad framerate",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/tloz_links_awakening.png",
            "tester": "wumbee"
        },
        {
            "game": "melatonin",
            "status": "perfect",
            "note": "make sure to calibrate delay in settings",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/melatonin.png",
            "tester": "wumbee"
        },
        {
            "game": "minecraft dungeons",
            "status": "in-game",
            "note": "shows no video, plays intro sound",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/minecraft_dungeons.png",
            "tester": "wumbee"
        },
        {
            "game": "neon abyss",
            "status": "playable",
            "note": "mild graphical glitches",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/neon_abyss.png",
            "tester": "wumbee"
        },
        {
            "game": "oceanhorn 2",
            "status": "boot",
            "note": "crashes system ui and makes android restart when loading",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/oceanhorn_2.png",
            "tester": "wumbee"
        },
        {
            "game": "omori",
            "status": "playable",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/omori.png",
            "tester": "wumbee"
        },
        {
            "game": "outlast",
            "status": "boot",
            "note": "deadlocks just before it gets to menu",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/outlast.png",
            "tester": "wumbee"
        },
        {
            "game": "owlboy",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/owlboy.png",
            "tester": "wumbee"
        },
        {
            "game": "pokemon brilliant diamond",
            "status": "nothing",
            "note": "opens before exiting the game, no logs created",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/pokemon_bd.png",
            "tester": "wumbee"
        },
        {
            "game": "portal",
            "status": "in-game",
            "note": "major graphical glitches, deadlock in chamber near the end",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/portal.png",
            "tester": "wumbee"
        },
        {
            "game": "pokemon: lets go eevee",
            "status": "playable",
            "note": "mostly full fps but drops",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/plge.png",
            "tester": "wumbee"
        },
        {
            "game": "potion permit",
            "status": "playable",
            "note": "fps drops",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/potion_permit.png",
            "tester": "wumbee"
        },
        {
            "game": "shadow fight 2",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/shadow_fight_2.png",
            "tester": "wumbee"
        },
        {
            "game": "shovel knight dig",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/shovel_knight_dig.png",
            "tester": "wumbee"
        },
        {
            "game": "skul: the hero slayer",
            "status": "playable",
            "note": "may need update to fix memleak",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/skul_the_hero_slayer.png",
            "tester": "wumbee"
        },
        {
            "game": "skyward sword",
            "status": "playable",
            "note": "fps drops, uncanny link eyes the text glitching out for 2 minutes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/tloz_ss.png",
            "tester": "wumbee"
        },
        {
            "game": "slay the spire",
            "status": "boot",
            "note": "deadlocks at blackscreen after logo",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/slay_the_spire.png",
            "tester": "wumbee"
        },
        {
            "game": "slime rancher",
            "status": "playable",
            "note": "30~60 fps, graphical bugs",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/slime_rancher.png",
            "tester": "wumbee"
        },
        {
            "game": "sonic mania",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/sonic_mania.png",
            "tester": "wumbee"
        },
        {
            "game": "spiritfarer",
            "status": "boot",
            "note": "crashes when loading save",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/spiritfarer.png",
            "tester": "wumbee"
        },
        {
            "game": "stardew valley",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/stardew_valley.png",
            "tester": "wumbee"
        },
        {
            "game": "steamworld dig",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/steamworld_dig.png",
            "tester": "wumbee"
        },
        {
            "game": "steamworld dig 2",
            "status": "playable",
            "note": "deadlocking if triple buffering is on",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/steamworld_dig_2.png",
            "tester": "wumbee"
        },
        {
            "game": "subnautica",
            "status": "playable",
            "note": "requires update, some textures may turn black",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/subnautica.png",
            "tester": "wumbee"
        },
        {
            "game": "super meat boy",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/super_meat_boy.png",
            "tester": "wumbee"
        },
        {
            "game": "tboi afterbirth+",
            "status": "perfect",
            "note": "requires update",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/tboi_afterbirth_plus.png",
            "tester": "wumbee"
        },
        {
            "game": "terraria",
            "status": "playable",
            "note": "requires settings, 30-60 fps with intro screen bugged",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/terraria.png",
            "tester": "wumbee"
        },
        {
            "game": "the survivalists",
            "status": "in-game",
            "note": "triple buffering must be off, unstable ~28 fps. getting it to work is annoying. refused after working once.",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/the_survivalists.png",
            "tester": "wumbee"
        },
        {
            "game": "the swords of ditto",
            "status": "playable",
            "note": "may freeze for a little bit during transition screen",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/the_swords_of_ditto.png",
            "tester": "wumbee"
        },
        {
            "game": "undertale",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/undertale.png",
            "tester": "wumbee"
        },
        {
            "game": "untitled goose game",
            "status": "playable",
            "note": "50 fps, slightly buggy",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/untitled_goose_game.png",
            "tester": "wumbee"
        },
        {
            "game": "vvvvvv",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/vvvvvv.png",
            "tester": "wumbee"
        },
        {
            "game": "webber",
            "status": "playable",
            "note": "minor flashing rarely and rare fps drops",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/webber.png",
            "tester": "wumbee"
        },
        {
            "game": "wizard of legend",
            "status": "playable",
            "note": "mostly 60 fps, difficult to beat because of lag",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/wizard_of_legend.png",
            "tester": "wumbee"
        }
    ],
    "unofficial": [
        {
            "game": "Ace attorney",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/ace_attorney.png",
            "tester": "tanos"
        },
        {
            "game": "Baba is you",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/baba_is_you.png",
            "tester": "tanos"
        },
        {
            "game": "Captain toad treasure tracker",
            "status": "ingame",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/captain_toad_treasure_tracker.png",
            "tester": "tanos"
        },
        {
            "game": "Crash Team Racing",
            "status": "playable",
            "note": "The game runs 30 fps but will break if you play for long time (memleak)",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/crash_team_racing.png",
            "tester": "yusef.sarkhani"
        },
        {
            "game": "Doki Doki",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/doki_doki.png",
            "tester": "tanos"
        },
        {
            "game": "Dude stop",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/dude_stop.png",
            "tester": "tanos"
        },
        {
            "game": "Game boy advance (NSO)",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/nso.png",
            "tester": "tanos"
        },
        {
            "game": "Good job",
            "status": "playable",
            "note": "only 10fps !",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/good_job.png",
            "tester": "tanos"
        },
        {
            "game": "Just shapes and beats",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/just_shapes_and_beats.png",
            "tester": "tanos"
        },
        {
            "game": "Kamiko",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/kamiko.png",
            "tester": "tanos"
        },
        {
            "game": "Minecraft",
            "status": "playable",
            "note": "Low fps ~20 FPS",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/minecraft.png",
            "tester": "tanos"
        },
        {
            "game": "Mini motorways",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/mini_motorways.png",
            "tester": "tanos"
        },
        {
            "game": "Payday 2",
            "status": "ingame",
            "note": "Crashes after pressing L2+R2",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/payday_2.png",
            "tester": "tanos"
        },
        {
            "game": "Persona 5 royal",
            "status": "nothing",
            "note": "Black screen",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/p5r.png",
            "tester": "tanos"
        },
        {
            "game": "Pico park",
            "status": "ingame",
            "note": "Bugged graphics",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/pico_park.png",
            "tester": "tanos"
        },
        {
            "game": "Pikuniku",
            "status": "ingame",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/pikuniku.png",
            "tester": "tanos"
        },
        {
            "game": "Portal 2",
            "status": "boot",
            "note": "Crashes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/portal_2.png",
            "tester": "tanos"
        },
        {
            "game": "Pokemon Legends Arceus",
            "status": "boot",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/pla.png",
            "tester": "yusef.sarkhani"
        },
        {
            "game": "Rain world",
            "status": "ingame",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/rain_world.png",
            "tester": "tanos"
        },
        {
            "game": "Road 96",
            "status": "ingame",
            "note": "Crashes after generating route",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/road_96.png",
            "tester": "tanos"
        },
        {
            "game": "Super Mario odyssey",
            "status": "ingame",
            "note": "Crashes at metro kingdom",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/smo.png",
            "tester": "tanos"
        },
        {
            "game": "Suoer Mario 3d World + Bowser fury",
            "status": "ingame",
            "note": "runs 50~60Fps both dock or undock, Bowser fury 20-30Fps 'Docked'  (mtk 8100)",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/mario_3d_world.png",
            "tester": "yusef.sarkhani"
        },
        {
            "game": "Sayonara wild hearts",
            "status": "boot",
            "note": "Crashes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/sayonara_wild_hearts.png",
            "tester": "tanos"
        },
        {
            "game": "Super smash bros ultimate",
            "status": "ingame",
            "note": "Crashes on big maps",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/ssbu.png",
            "tester": "tanos"
        },
        {
            "game": "The binding of issac repentance (JP)",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/tboi_afterbirth_plus.png",
            "tester": "tanos"
        },
        {
            "game": "The Stanley parable",
            "status": "ingame",
            "note": "Crashes randomly if you choose wrong path",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/the_stanley_parable.png",
            "tester": "tanos"
        },
        {
            "game": "Toodee and topdee",
            "status": "boot",
            "note": "crashes",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/toodee_and_topdee.png",
            "tester": "tanos"
        },
        {
            "game": "Void prison",
            "status": "perfect",
            "note": "null",
            "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/void_prison.png",
            "tester": "tanos"
        },
        {
            "game": "What the golf",
            "status": "playable",
            "note": "30~fps",
    "logo": "https://hakureii.github.io/compat-list-mali/assets/images/cover/what_the_golf.png",
        "tester": "tanos"
        }
    ],
    "homebrew": [
        {
            "game": "dhewm3-nx",
            "status": "nothing",
            "note": "No logs created, exits out",
            "logo": "null",
            "tester": "wumbee"
        },
        {
            "game": "nx-hbmenu",
            "status": "boot",
            "note": "Obviously doesn't like skyline, throws error",
            "logo": "null",
            "tester": "wumbee"
        },
        {
            "game": "Ship of Harkanian",
            "status": "boot",
            "note": "Logs created, skyline missing necessary requirements",
            "logo": "null",
            "tester": "wumbee"
        }
    ]
}`;
// thank lawd I don't have to add api keys
var roster = 10;
var index = Math.floor(Math.random() * roster) + 1;
var optionA = {"text": "Safe", "query": "rating:safe"};
var optionB = {"text": "Questionable", "query": "rating:questionable"};
var chosen;
var query = "hexerade";
var query2 = "-rating:explicit";

function resetSettings() {
    // Set to default values
    optionA.query = "rating:safe";
    optionB.query = "rating:questionable";
    optionA.text = "Safe";
    optionB.text = "Questionable";
    query = "hexerade";
    query2 = "-rating:explicit";
    roster = 10;

    document.getElementById("charQuery").value = query;
    document.getElementById("extraQuery").value = query2;
    document.getElementById("optionAInput").value = optionA.query;
    document.getElementById("optionBInput").value = optionB.query;
    document.getElementById("optionAText").value = optionA.text;
    document.getElementById("optionBText").value = optionB.text;
    document.getElementById("roster").value = roster;
}
const savedSettings = JSON.parse(localStorage.getItem('settings'));

function loadSettings() {
    if (savedSettings) {
        optionA.query = savedSettings.optionA.query || optionA.query;
        optionB.query = savedSettings.optionB.query || optionB.query;
        optionA.text = savedSettings.optionA.text || optionA.text;
        optionB.text = savedSettings.optionB.text || optionB.text;
        query = savedSettings.query || query;
        query2 = savedSettings.query2 || query2;
        roster = savedSettings.roster || roster;
    }
    
    // Set the values to the UI elements
    document.getElementById("charQuery").value = query;
    document.getElementById("extraQuery").value = query2;
    document.getElementById("optionAInput").value = optionA.query;
    document.getElementById("optionBInput").value = optionB.query;
    document.getElementById("optionAText").value = optionA.text;
    document.getElementById("optionBText").value = optionB.text;
    document.getElementById("roster").value = roster;
}

function initialize() {
    loadSettings();
    chosen = Math.random() < 0.5 ? optionA : optionB; // Choose randomly after loading settings
}

initialize();

async function fetchRandomImage() {
    const url = `https://e621.net/posts.json?tags=${query2}+${query.replaceAll(" ", "_")}+${chosen.query}&limit=${index}`;
    const headers = {
        "User-Agent": "guess621/1.0",
    };
    document.getElementById("tutorial").style.display = "none"; 
    document.getElementById("settings").style.display = "none"; 
    query = document.getElementById("charQuery").value;
    query2 = document.getElementById("extraQuery").value;
    optionA.query = document.getElementById("optionAInput").value;
    optionB.query = document.getElementById("optionBInput").value;
    optionA.text = document.getElementById("optionAText").value;
    optionB.text = document.getElementById("optionBText").value;
    document.getElementById("optionA").innerHTML = optionA.text;
    document.getElementById("optionB").innerHTML = optionB.text;
    document.getElementById("roster").innerHTML = roster;

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.posts && data.posts.length > 0) {
            var imageUrl = data.posts.length >= index ? data.posts[index - 1].file.url : data.posts[data.posts.length - 1].file.url;
            var fileType = data.posts[index - 1].file.ext;
            if (fileType == "jpg" || fileType == "png" || fileType == "gif") {
                document.getElementById("image").innerHTML = "<img src='"+ imageUrl +"' width='300px' />";
            } else {
                document.getElementById("image").innerHTML = "<video src='"+ imageUrl +"' width='300px' />";
            }
            document.getElementById("image").classList = "centerImage";
            document.getElementById("artist").innerHTML = data.posts[index - 1].tags.artist[0];
            document.getElementById("link").innerHTML = "<a href='https://e621.net/posts/" + data.posts[index - 1].id + "' target='_blank'>Link</a>";
        } else {
            console.log("No images found.");
        }
    } catch (error) {
        console.error("Error fetching random image:", error);
    }
}

function playAgainQuery(isCorrect) {
    if (isCorrect) {
        document.getElementById("correctOrIncorrect").innerHTML = "Correct!";
    } else {
        document.getElementById("correctOrIncorrect").innerHTML = "Incorrect.";
    }
    document.getElementById("chosen").style.display = "block";
    document.getElementById("ask").style.display = "none";
}

function optionAPicked() {
    if (chosen === optionA) {
        console.log("yes.");
        playAgainQuery(true);
    } else {
        console.log("no.");
        playAgainQuery(false);
    }
}

function optionBPicked() {
    if (chosen === optionB) {
        console.log("yes.");
        playAgainQuery(true);
    } else {
        console.log("no.");
        playAgainQuery(false);
    }
}

function playAgain() {
    // Save settings to localStorage
    query = document.getElementById("charQuery").value;
    query2 = document.getElementById("extraQuery").value;
    optionA.query = document.getElementById("optionAInput").value;
    optionB.query = document.getElementById("optionBInput").value;
    optionA.text = document.getElementById("optionAText").value;
    optionB.text = document.getElementById("optionBText").value;
    roster = document.getElementById("roster").value;
    const settings = {
        optionA: optionA,
        optionB: optionB,
        query: query,
        query2: query2,
        roster: roster,
    };
    localStorage.setItem('settings', JSON.stringify(settings));

    chosen = Math.random() < 0.5 ? optionA : optionB;
    index = Math.floor(Math.random() * roster) + 1;
    document.getElementById("chosen").style.display = "none";
    document.getElementById("ask").style.display = "block";
    fetchRandomImage();
}

function openSettings() {
    const settingsElement = document.getElementById("settings");
    if (settingsElement.style.display === "block") {
        settingsElement.style.display = "none";
    } else {
        settingsElement.style.display = "block";
    }
}
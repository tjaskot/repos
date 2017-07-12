/* This is CHANGEMODETO.JS */

function changeModeTo(mode) {
        editor.session.setMode("ace/mode/" + mode.value);
        // this tests the console for output of setMode
        //console.log("mode");
    }

//need to make function here
function callCsvs() {
    listOfItems = ["Modes.csv", "Themes.csv"];
    listOfItemsID = ["mode", "theme"];
    for (var i = 0; i <= listOfItems.length-1; i++) {
        var csvFile = listOfItems[i]; 
        loadCSV(fileExt, csvFile);
        localStorage.removeItem("fileExt");
    }
}

function loadCSV(fileExt, csvFile) {
    /*Load ajax http request*/
    var xhttp = new XMLHttpRequest();
    xhttp.overrideMimeType('text/plain');
    
    /*once the file is loaded run function*/
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            /*get text of file; split the data by each row*/
            var allText = xhttp.responseText;
            var splitData = allText.split("\n");
            
            /*for each row split the data by comma separator*/
            for (var i = 1; i < splitData.length-1; i++) {
                var splitLine = splitData[i].split(",");
                
                /*create Option html tag with value and text using data from split line
                replace extra quotation mark from when the csv was read */
                var optionNode = document.createElement("option");
                optionNode.value = splitLine[0].replace('"', "");
                optionNode.text = splitLine[1].replace('"', "");
                
                //create variable for passing the csv File ID (can add more csv files by creating elseIf)
                var csvFileID = "";
                if (csvFile == "Modes.csv"){
                    csvFileID = "mode";
                }
                else (csvFileID = "theme");
                
                /*append newly created Option to Mode DropDown*/
                parentNode = document.getElementById(csvFileID);
                parentNode.appendChild(optionNode);
                //this verifies optionNode
                //console.log("option added");
            }
        findMode(fileExt);
        //verifies findMode
        //console.log("findMode ran");
        }
    };
    //ajax request to Open csv file 
    xhttp.open("GET", csvFile, true);
    xhttp.send();
}

function findMode(fileExt) {
    switch (fileExt) {
        case "py": 
            fileExt = "python";
            break;
        case "js": 
            fileExt = "javascript";
            break;
        case "txt":
            fileExt = "plain_text";
            break;
        default: 
            fileExt;
    }
    document.getElementById("mode").value = fileExt;
    document.getElementById("mode").click();
}
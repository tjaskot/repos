function changeModeTo(mode) {
        editor.session.setMode("ace/mode/" + mode.value);
//        editor.session.setMode("ace/mode/python");
    }
    
    
function loadCSV() {
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
                
                /*append newly created Option to Mode DropDown*/
                parentNode = document.getElementById("mode");
                parentNode.appendChild(optionNode);
            }
        }
    };
    //ajax request to Open csv file 
    xhttp.open("GET", "Modes.csv", true);
    xhttp.send();
}
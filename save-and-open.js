document.getElementById("saveButton").onclick = function(){
    var fullText = "";
    var textFile;
    var text = document.getElementsByClassName("ace_line");
    for (i=0;i<text.length;i++){
        fullText += text[i].innerText + "\r\n";
    }
    var data = new Blob([fullText], {type: 'application/octet-stream'});
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }   
    //creates URL used in href
    textFile = window.URL.createObjectURL(data);
    document.getElementById("saveButton").href = textFile;
    var fileNamed = document.getElementById("fileNamed").value;
    if (fileNamed !== null || fileNamed !== "" ) { 
        document.getElementById("saveButton").download = fileNamed;
    }
};
  
function loadFileAsText()
{
    var fileName = document.getElementById("fileToLoad").files[0];
    var fileNamed = fileName.name;
    var fileExt = fileName.name.split('.')[1];
    fileReader = new FileReader();
    var fileContents;
    fileReader.onload = function () {
	fileContents = fileReader.result;
	console.log(fileContents); 
    };
    fileReader.onloadend = function(evt) {
	localStorage.setItem("file", fileContents);
	localStorage.setItem("fileExt", fileExt);
	localStorage.setItem("fileNamed", fileNamed);
	window.open("editor.html", "_self");
    };
    fileReader.readAsText(fileName, "utf-8");
}

function extractedvals() {
    var tobeextractedvals = document.getElementsByClassName('ace_layer ace_text-layer');
    for (var i=0;i<tobeextractedvals.length;i++){
        console.log(tobeextractedvals[i].textcontent);
    }
}
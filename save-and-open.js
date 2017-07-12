var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };
  
function loadFileAsText()
{
    var fileName = document.getElementById("fileToLoad").files[0];
    var fileExt = fileName.name.split('.')[1];
    fileReader = new FileReader();
    var fileContents;
    fileReader.onload = function () {
	fileContents = fileReader.result;
	console.log(fileContents); 
    }
    fileReader.onloadend = function(evt) {
	localStorage.setItem("file", fileContents);
	localStorage.setItem("fileExt", fileExt);
	window.open("editor.html", "_self");
    }
    fileReader.readAsText(fileName, "utf-8");
}

function extractedvals() {
    var tobeextractedvals = document.getElementsByClassName('ace_layer ace_text-layer');
    for (var i=0;i<tobeextractedvals.length;i++){
        console.log(tobeextractedvals[i].textcontent);
    }
}
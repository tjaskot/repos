function saveTextAsFile()
{
    var textToSave = document.getElementById("inputTextToSave").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    var downloadLink = document.createElement("a");

    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
  
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
  
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
 
function loadFileAsText()
{
    var fileName = document.getElementById("fileToLoad").files[0];
    fileReader = new FileReader();
    var fileContents;
    fileReader.onload = function () {
	fileContents = fileReader.result;
	console.log(fileContents); 
    }
    fileReader.onloadend = function(evt) {
	localStorage.setItem("file", fileContents);
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
#! /usr/bin/env node
const shell = require("shelljs");
let fs= require('fs');

console.log("*** BUILDING APP ***")
shell.exec("rm -rf www");
shell.exec("SKIP_PREFLIGHT_CHECK=true react-scripts build");

console.log("*** Creating NATIVE BUILD ***")
let data = fs.readFileSync('./build/index.html', 'utf8');
function insertContent(fullContent, beforeWhat, newContent) {
  const position = fullContent.indexOf(beforeWhat);
  let fullContentCopy = fullContent.split('');
  fullContentCopy.splice(position, 0, newContent);
  return fullContentCopy.join('');
}

const afterAddingMeta = insertContent(data, "<link",
    ``+
    `<meta name="format-detection" content="telephone=no">`+
    `<meta name="msapplication-tap-highlight" content="no">`);

let afterAddingScript = insertContent(afterAddingMeta, "<script", `<script type="text/javascript" src="cordova.js"></script>`);

// change to relative pathing
afterAddingScript = afterAddingScript.replace(/="\/static\//g, '="static/');

// updates the index.html file
fs.writeFile('./build/index.html', afterAddingScript, 'utf8', (err)=> {
  if(err) {
    throw err
  } else postBuild();
});

function postBuild() {
  console.log("*** Running POSTBUILD ***")
  shell.exec("mv build www");
  shell.exec("cordova prepare ios");
}

#! /usr/bin/env node
const fs = require('fs');
const project_dir = './platforms/ios';
const path = require('path');
const shell = require("shelljs");

fs.readdir(project_dir, (err, items) => {
  items.forEach((item) => {
    if(item.endsWith('xcworkspace')) {
      const xc_path = path.join(project_dir, item);
      console.log("*** OPENING XCODE PROJECT ***")
      shell.exec(`open ${xc_path}`);
    }
  })
});

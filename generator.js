var fs = require("fs");
const path = require("path");
const execSync = require('child_process').execSync;

let videoPath = process.argv[2];
let logDir = (process.argv[3]) ? process.argv[3] : '.';
let outputPath = (process.argv[4]) ? process.argv[4] : 'output.txt';
console.log("videoPath: %s", videoPath);
console.log("logDir: %s", logDir);
console.log("outputPath: %s", outputPath);
console.log("parseTimeFromPath: %s", parseTimeFromPath(videoPath));
console.log("videoPathDate: %s", new Date(parseTimeFromPath(videoPath)));
console.log("getVideoDuration: %s", getVideoDuration(videoPath));

function parseTimeFromPath(_path) {
  let basename = path.basename(_path, '.mkv');
  let newTime = basename.substring(0, 10) + 'T'
    + basename.substring(11, basename.length).replace(/-/g,':');
  return Date.parse(newTime);
}

function getVideoDuration(path) {
  let command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ` + path;
  return execSync(command);
}

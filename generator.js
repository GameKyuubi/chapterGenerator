var fs = require("fs");
const path = require("path");
const execSync = require('child_process').execSync;

let videoPath = process.argv[2];
let logPath = (process.argv[3]) ? process.argv[3] : '.';
let outputPath = (process.argv[4]) ? process.argv[4] : 'output.txt';
console.log("videoPath: %s", videoPath);
console.log("logDir: %s", logPath);
console.log("outputPath: %s", outputPath);
console.log("parseTimeFromPath: %s", parseTimeFromBasename(path.basename(videoPath, '.mkv')));
console.log("videoPathDate: %s", new Date(parseTimeFromBasename(path.basename(videoPath, '.mkv'))));
console.log("getVideoDuration: %s", getVideoDuration(videoPath));

console.log(path.basename(videoPath, '.mkv'));
let startTime = parseInt(parseTimeFromBasename(path.basename(videoPath, '.mkv')));
let endTime = parseInt(startTime) + parseInt(getVideoDuration(videoPath)) * 1000;
console.log("startTime %s endTime %s", startTime, endTime);

let logFilesInRange = [];
let arrayOfYTLines = [];

if (fs.lstatSync(logPath).isDirectory()) {
  let allFiles = fs.readdirSync(logPath);
  let logs = allFiles.filter((element, index, array) => {
    let logTime = parseInt(parseTimeFromBasename(element.slice(4, -4)));
    console.log("startTime %s | logTime %s | endTime %s", startTime, logTime, endTime);
    console.log("index %s, arrayLength %s", index, array.length);
    let lastIndex = array.length - 1;
    // if this is the last item and startTime is larger
    if((index >= lastIndex) && (logTime <= startTime)) {
      console.log("1");
      return logTime;
    }
    // if logTime is inbetween startTime and endTime
    if(logTime > startTime && logTime < endTime) {
      console.log("2");
      return logTime;
    }
    // if logtime is less than startTime and array+1 is after startTime
    if(index < lastIndex) {
      console.log("3");
      let nextTime = parseInt(parseTimeFromBasename(array[index + 1].slice(4, -4)));
      if (logTime < startTime && nextTime > startTime) {
        console.log("4");
        return logTime;
      }
    }
  });
  console.log(logs);
}

function parseTimeFromBasename(basename) {
  let newTime = basename.substring(0, 10) + 'T'
    + basename.substring(11, basename.length).replace(/-/g,':');
  console.log("basename: %s, newTime %s", basename, newTime);
  return Date.parse(newTime);
}

function getVideoDuration(_path) {
  let command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ` + _path;
  return execSync(command);
}

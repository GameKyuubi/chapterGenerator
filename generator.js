var fs = require("fs");
const path = require("path");
const execSync = require('child_process').execSync;

let videoPath = process.argv[2];
let logPath = (process.argv[3]) ? process.argv[3] : '.';
let outputPath = (process.argv[4]) ? process.argv[4] : 'output.txt';

let startTime = parseInt(parseTimeFromBasename(path.basename(videoPath, '.mkv')));
startTime = new Date(startTime);
let endTime = parseInt(startTime) + parseInt(getVideoDuration(videoPath)) * 1000;
endTime = new Date(endTime);

let logFilesInRange = [];
let arrayOfYTLines = [];

if (fs.lstatSync(logPath).isDirectory()) {
  let allFiles = fs.readdirSync(logPath);
  let logs = allFiles.filter((element, index, array) => {
    let logTime = parseInt(parseTimeFromBasename(element.slice(4, -4)));
    let lastIndex = array.length - 1;
    // if this is the last item and startTime is larger
    if((index >= lastIndex) && (logTime <= startTime)) {
      return logTime;
    }
    // if logTime is inbetween startTime and endTime
    if(logTime > startTime && logTime < endTime) {
      return logTime;
    }
    // if logtime is less than startTime and array+1 is after startTime
    if(index < lastIndex) {
      let nextTime = parseInt(parseTimeFromBasename(array[index + 1].slice(4, -4)));
      if (logTime < startTime && nextTime > startTime) {
        return logTime;
      }
    }
  });
  console.log(logs);
  let timeLines = [];
  logs.forEach((log, index, array) => {
    console.log(logPath + log);
    let data = fs.readFileSync(logPath + log);
    let logLines = data.toString().split("\n");
    logLines.map((line, index, array) => {
      if(line.includes("MAP IS NOW")) {
        let time = new Date(array[index-1]);
        if(time > startTime) {
          let seconds = (time - startTime)/1000;
          let minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          if(seconds < 10)
            seconds = "0" + seconds;
          let hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          if(minutes < 10)
            minutes = "0" + minutes;
          let map = line.split('"')[1];
          timeLines.push(hours+":"+minutes+":"+seconds+" "+map);
        }
      }
    });
    console.log(timeLines.join("\n"));
  });
}

function parseTimeFromBasename(basename) {
  let newTime = basename.substring(0, 10) + 'T'
    + basename.substring(11, basename.length).replace(/-/g,':');
  return Date.parse(newTime);
}

function getVideoDuration(_path) {
  let command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ` + _path;
  return execSync(command);
}

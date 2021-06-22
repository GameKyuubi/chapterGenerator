var fs = require("fs");

let videoPath = process.argv[2];
let logDir = (process.argv[3]) ? process.argv[3] : '.';
let outputPath = (process.argv[4]) ? process.argv[4] : 'output.txt';
console.log("videoPath: %s", videoPath);
console.log("logDir: %s", logDir);
console.log("outputPath: %s", outputPath);

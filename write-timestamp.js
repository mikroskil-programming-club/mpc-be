// write timestamp to file
// Usage: node write-timestamp.js <filename>

const fs = require('fs');
const filename = "timestamp.txt";
const date = new Date();
date.setUTCHours(date.getUTCHours() + 7);
fs.writeFileSync("netlify/functions/membership/" + filename, date.toUTCString());
fs.writeFileSync("netlify/functions/stats/" + filename, date.toUTCString());

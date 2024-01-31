const fs = require('fs');
const path = require("path");
require("dotenv").config();

// cors headers
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*"
};

exports.handler = async event => {
  const response = await fetch(process.env.FILEPATH, {
    headers: {
      Authorization: "Bearer " + process.env.TOKEN
    }
  });
  const data = await response.json();
  const content = Buffer.from(data.content, "base64").toString();
  const members = (JSON.parse(content)).data;
  const body = {};
  // paid member count
  body.paid = members.filter(member => member.paid).length;
  // unpaid member count
  body.unpaid = members.filter(member => !member.paid).length;
  // total member count
  body.total = members.length;  

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  }
}
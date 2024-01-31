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
    if (!event.queryStringParameters.nim && !event.queryStringParameters.NIM) {
        return {
            statusCode: 400,
            body: "NIM is required",
            headers
        }
    }
    const nim = event.queryStringParameters.nim || event.queryStringParameters.NIM;

    const response = await fetch(process.env.FILEPATH, {
        headers: {
            Authorization: "Bearer " + process.env.TOKEN
        }
    });
    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString();
    const parsedContent = JSON.parse(content);
    const members = parsedContent.data;

    const commitRes = await fetch("https://api.github.com/repos/trisbman/mpc-be/commits", {
        headers: {
            Authorization: "Bearer " + process.env.TOKEN
        }
    });
    const commitData = await commitRes.json();
    const modifiedDt = commitData[0].commit.author.date;
    const formattedDt = new Intl.DateTimeFormat("en-ID", {
        dateStyle: "full",
        timeStyle: "long"
    }).format(new Date(modifiedDt));

    const member = members.find(member => member.NIM == nim);
    if (!member) {
        return {
            statusCode: 404,
            body: "Member not found",
            headers
        }
    }

    member.paid = member.paid || false;

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            "name": member.fullName,
            "paid": member.paid,
            "nim": member.NIM,
            "lastUpdated": formattedDt
        }),
    }
}
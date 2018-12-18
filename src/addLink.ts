"use strict";

interface Params {
  link: string;
}

export async function addBlogLink(event, _context, _callback) {
  // getNewLinkFromEventBody();
  const body = event.body;

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No Request Body!"
      })
    };
  }

  let params: Params;
  try {
    params = JSON.parse(body);
    console.log(params);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "You sent malformed request body"
      })
    };
  }

  // check it already exists in DB
  // save it to DB
  // return the latest list

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
}

"use strict";

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

  console.log(body);

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

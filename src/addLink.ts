"use strict";

export async function addBlogLink(event, _context, _callback) {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
}

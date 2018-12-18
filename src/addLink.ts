"use strict";

import * as uuid from "uuid/v1";
import DynamoDBManager from "./model";

interface Params {
  link: string;
}

export async function addBlogLink(event, _context, _callback) {
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

  const id = uuid();

  try {
    await DynamoDBManager.putBlogLink({
      id: id,
      link: params.link,
      active: false
    });
  } catch (_err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Failed to save link item to DynamoDB."
      })
    };
  }

  // check it already exists in DB
  // return the latest list

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "You sent malformed request body"
    })
  };
}

"use strict";

import * as uuid from "uuid/v1";
import * as url from "url";
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
  const linkUrlObject = url.parse(params.link);
  const cleanUrl = `${linkUrlObject.protocol}//${linkUrlObject.host}${
    linkUrlObject.pathname
  }`;

  try {
    await DynamoDBManager.putBlogLink({
      id: id,
      link: cleanUrl,
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
    statusCode: 200,
    body: JSON.stringify({
      message: `Succeed to save ${id}`
    })
  };
}

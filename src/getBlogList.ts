"use strict";

import DynamoDBManager, { BlogLink } from "./model";

export async function getBlogList(event, _context, _callback) {
  try {
    const res = await DynamoDBManager.getBlogList();

    return {
      statusCode: 200,
      body: JSON.stringify({
        blogList: res
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Failed to get blog info list to DynamoDB."
      })
    };
  }
}

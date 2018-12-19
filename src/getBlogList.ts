"use strict";

import DynamoDBManager from "./model";
import makeErrorResponse from "./helper/makeErrorResponse";

export async function getBlogList(event, _context, _callback) {
  const qs = event.queryStringParameters;
  let key: string = "";
  if (qs) {
    key = qs.key;
  }
  const isAdmin = key && key === process.env["BLOG_LINK_ADMIN_KEY"];

  try {
    const blogList = await DynamoDBManager.getBlogList();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        // HACK: Move below logic to Query(Scan) Logic
        blogList: isAdmin ? blogList : blogList.filter(blog => blog.active)
      })
    };
  } catch (err) {
    console.error(err);
    return makeErrorResponse(400, "Failed to get blog info list to DynamoDB.");
  }
}

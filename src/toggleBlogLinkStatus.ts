"use strict";

import DynamoDBManager, { BlogLink } from "./model";
import makeErrorResponse from "./helper/makeErrorResponse";

interface Params {
  id: string;
}

export async function toggleBlogLinkStatus(event, _context, _callback) {
  const body = event.body;
  const qs = event.queryStringParameters;
  let key: string = "";
  if (qs) {
    key = qs.key;
  }
  const isAdmin = key && key === process.env["BLOG_LINK_ADMIN_KEY"];

  if (!body) {
    return makeErrorResponse(400, "No Request Body!");
  }

  if (!isAdmin) {
    return makeErrorResponse(403, "You are not authorized user");
  }

  let params: Params;
  try {
    params = JSON.parse(body);
  } catch (err) {
    return makeErrorResponse(400, "You sent malformed request body");
  }

  let blogLink: BlogLink;
  try {
    const res = await DynamoDBManager.getBlogInfoById(params.id);
    if (!res) {
      throw new Error();
    }
    blogLink = res;
  } catch (err) {
    return makeErrorResponse(400, "Can't get blog Information from DynamoDB");
  }

  const startLength = (blogLink.startTime && blogLink.startTime.length) || 0;
  const endLength = (blogLink.endTime && blogLink.endTime.length) || 0;

  let isNewStart: boolean = true;
  if (startLength !== endLength) {
    isNewStart = false;
  }

  try {
    const res = await DynamoDBManager.putBlogLink({
      ...blogLink,
      active: !blogLink.active,
      startTime: isNewStart
        ? [...(blogLink.startTime || []), new Date()]
        : blogLink.startTime,
      endTime: isNewStart
        ? blogLink.endTime
        : [...(blogLink.endTime || []), new Date()]
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        link: res.originalItem()
      })
    };
  } catch (err) {
    console.error(err);
    return makeErrorResponse(400, "Failed to save link item to DynamoDB.");
  }
}

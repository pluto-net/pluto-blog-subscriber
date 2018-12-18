"use strict";

import DynamoDBManager, { BlogLink } from "./model";

interface Params {
  id: string;
}

export async function toggleBlogLinkStatus(event, _context, _callback) {
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
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "You sent malformed request body"
      })
    };
  }

  let blogLink: BlogLink;
  try {
    const res = await DynamoDBManager.getBlogInfoById(params.id);
    if (!res) {
      throw new Error();
    }
    blogLink = res;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Can't get blog Information from DynamoDB"
      })
    };
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
      body: JSON.stringify({
        link: res.originalItem()
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Failed to save link item to DynamoDB."
      })
    };
  }
}

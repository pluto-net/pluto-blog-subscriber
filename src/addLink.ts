"use strict";

import * as uuid from "uuid/v1";
import * as url from "url";
import DynamoDBManager, { BlogLink } from "./model";
import dynamoDBManger from "./model";

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

  let blogLink: BlogLink | null = null;
  try {
    const res: any = await DynamoDBManager.getBlogLinkByLink(cleanUrl);
    // TODO: REMOVE BELOW CONSOLE
    console.log(res);

    if (res && res.count > 0) {
      blogLink = res[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (blogLink) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "link already exists."
      })
    };
  }

  try {
    const res = await DynamoDBManager.putBlogLink({
      id: id,
      link: cleanUrl,
      active: false
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        link: res.originalItem()
      })
    };
  } catch (_err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Failed to save link item to DynamoDB."
      })
    };
  }
}

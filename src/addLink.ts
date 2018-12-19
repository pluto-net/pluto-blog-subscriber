"use strict";

import * as uuid from "uuid/v1";
import * as url from "url";
import DynamoDBManager, { BlogLink } from "./model";
import { getOgInfoFromUrl, OgInformation } from "./sideEffect/crawOgInfo";
import makeErrorResponse from "./helper/makeErrorResponse";

interface Params {
  link: string;
}

export async function addBlogLink(event, _context, _callback) {
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

  const id = uuid();
  const linkUrlObject = url.parse(params.link);
  const cleanUrl = `${linkUrlObject.protocol}//${linkUrlObject.host}${
    linkUrlObject.pathname
  }`;

  let blogLink: BlogLink | null = null;
  try {
    const res: any = await DynamoDBManager.getBlogLinkByLink(cleanUrl);

    if (res && res.count > 0) {
      blogLink = res[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (blogLink) {
    return makeErrorResponse(400, "link already exists.");
  }

  let ogBlogInfo: OgInformation;
  try {
    const res = await getOgInfoFromUrl(cleanUrl);
    if (res) {
      ogBlogInfo = res;
    } else {
      throw new Error();
    }
  } catch (err) {
    return makeErrorResponse(500, "Not available blog link.");
  }

  try {
    const res = await DynamoDBManager.putBlogLink({
      id: id,
      link: cleanUrl,
      active: false,
      ogImageUrl: ogBlogInfo.ogImageUrl,
      ogTitle: ogBlogInfo.ogTitle,
      ogDescription: ogBlogInfo.ogDescription
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
  } catch (_err) {
    return makeErrorResponse(400, "Failed to save link item to DynamoDB.");
  }
}

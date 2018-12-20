import Axios from "axios";
import * as cheerio from "cheerio";

export interface OgInformation {
  ogImageUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export async function getOgInfoFromUrl(
  url: string
): Promise<OgInformation | undefined> {
  try {
    const res = await Axios.get(url, {
      headers: { Accept: "text/html; charset=utf-8" },
      responseType: "text"
    });
    const rawBlogHtml = res.data;
    const $ = cheerio.load(rawBlogHtml);
    const ogImageUrl = $("meta[property='og:image']").attr("content");
    const ogTitle = $("meta[property='og:title']")
      .attr("content")
      .replace(" – Pluto Network – Medium", "");
    const ogDescription = $("meta[property='og:description']").attr("content");

    return {
      ogImageUrl,
      ogTitle,
      ogDescription
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

import * as dynamoose from "dynamoose";
import { OgInformation } from "../sideEffect/crawOgInfo";

const TABLE_NAME = "blogSubscriberTable";

export interface BlogLink extends OgInformation {
  id: string;
  link: string;
  active: boolean;
  startTime?: Date[];
  endTime?: Date[];
  createdAt?: Date;
  updatedAt?: Date;
}

const Schema = dynamoose.Schema;
const blogLinkSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true
    },
    link: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    ogImageUrl: {
      type: String
    },
    ogTitle: {
      type: String
    },
    ogDescription: {
      type: String
    },
    startTime: {
      type: [Date]
    },
    endTime: {
      type: [Date]
    }
  },
  {
    timestamps: true,
    useDocumentTypes: true
  }
);

const BlogLinkModel = dynamoose.model<BlogLink, { id: string }>(
  TABLE_NAME,
  blogLinkSchema
);

class DynamoDBManager {
  async getBlogLinkByLink(link: string) {
    try {
      const res = await BlogLinkModel.scan({ link: { eq: link } }).exec();
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async getBlogInfoById(id: string) {
    try {
      const res = await BlogLinkModel.get({ id });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getBlogList() {
    try {
      const res = await BlogLinkModel.scan()
        .limit(100)
        .exec();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async putBlogLink(blogLink: BlogLink) {
    try {
      const blogLinkModel = new BlogLinkModel(blogLink);
      const res = await blogLinkModel.save();
      return res;
    } catch (err) {
      console.error("had an error to put link item in DynamoDB.");
      throw new Error(err);
    }
  }
}

const dynamoDBManger = new DynamoDBManager();

export default dynamoDBManger;

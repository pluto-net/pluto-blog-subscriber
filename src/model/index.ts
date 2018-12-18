import * as dynamoose from "dynamoose";
import { ScanInterface } from "dynamoose";

const TABLE_NAME = "blogSubscriberTable";

export interface BlogLink {
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

  // async updateDynamoDB(paper: Paper) {
  //   try {
  //     await PaperModel.update(
  //       { paper_id: paper.paperId },
  //       {
  //         paper_pdf: paper.paperPdf,
  //         process_status: paper.processStatus,
  //         paper_images: paper.paperImages
  //       }
  //     );
  //   } catch (err) {
  //     console.error("ERROR OCCURRED AT UPDATE DYNAMO_DB ITEM");
  //     throw new Error(err);
  //   }
  // }
}

const dynamoDBManger = new DynamoDBManager();

export default dynamoDBManger;

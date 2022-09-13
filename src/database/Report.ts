import * as mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import { Tool } from "../tools";

export interface IReport {
  contract: mongoose.Types.ObjectId;
  tool: Tool;
  details: string;
  md5: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<IReport>(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
    },
    tool: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    md5: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
schema.plugin(MongooseDelete, { deletedAt: true });

const Report = mongoose.model<IReport>("Report", schema);

export default Report;

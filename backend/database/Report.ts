import * as mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import { Tool } from "../tools";

export interface Report {
  contract: mongoose.Types.ObjectId;
  tool: Tool;
  md5: string;
  details: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<Report>(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
    },
    tool: {
      type: String,
      required: true,
    },
    md5: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
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

const ReportModel = mongoose.model<Report>("Report", schema);

export default ReportModel;

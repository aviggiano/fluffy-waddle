import * as mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import { Explorer } from "../tools/explorer";

export interface IBlockchain {
  caip: string;
  name: string;
  explorer: Explorer;

  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<IBlockchain>(
  {
    caip: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    explorer: {
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

const Blockchain = mongoose.model<IBlockchain>("Blockchain", schema);

export default Blockchain;

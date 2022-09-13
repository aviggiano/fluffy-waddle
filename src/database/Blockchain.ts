import * as mongoose from "mongoose";
import { Explorer } from "../tools/explorer";

export interface IBlockchain {
  caip: string;
  name: string;
  explorer: Explorer;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<IBlockchain>(
  {
    caip: {
      type: String,
      required: true,
    },
    explorer: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

    deleted: {
      type: Boolean,
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

const Blockchain = mongoose.model<IBlockchain>("Blockchain", schema);

export default Blockchain;

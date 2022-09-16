import * as mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

export interface Contract {
  address: string;
  blockchain: mongoose.Types.ObjectId;

  name?: string;
  compiler?: string;
  version?: string;
  balance?: number;
  txns?: number;
  setting?: string;
  verified?: Date;
  audited?: string;
  license?: string;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema<Contract>(
  {
    address: {
      type: String,
      required: true,
    },
    blockchain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blockchain",
    },
    name: {
      type: String,
    },
    compiler: {
      type: String,
    },
    version: {
      type: String,
    },
    balance: {
      type: Number,
    },
    txns: {
      type: Number,
    },
    setting: {
      type: String,
    },
    verified: {
      type: Date,
    },
    audited: {
      type: String,
    },
    license: {
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

const ContractModel = mongoose.model<Contract>("Contract", schema);

export default ContractModel;

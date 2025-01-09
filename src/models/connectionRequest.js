const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: "{VALUE} is invalid status",
      },
    },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({fromUserId: 1, toUserId: 1});

ConnectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);

const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { toUserId, status } = req.params;
      const fromUserId = req.user._id;

      if (!["ignored", "interested"].includes(status)) {
        throw new Error(`${status} is invalid status type`);
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("user not present in the database");
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("connection request already exists!");
      }
      const connectionRequest = new ConnectionRequest({
        toUserId,
        fromUserId,
        status,
      });
      await connectionRequest.save();
      res.send("connection request sent successfully!");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

connectionRequestRouter.post(
  "/review/:status/:connectionRequestId",
  userAuth,
  async (req, res) => {
    try {
      const { connectionRequestId, status } = req.params;
      const loggedInUserId = req.user._id;
      if (!["accepted", "rejected"].includes(status)) {
        throw new Error(`${status} is invalid status type`);
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        _id: connectionRequestId,
        toUserId: loggedInUserId,
        status:"interested"
      });
      if (!existingConnectionRequest) {
        throw new Error(
          `connection request id ${connectionRequestId} is invalid`
        );
      }
      await ConnectionRequest.findOneAndUpdate(
        { _id: connectionRequestId },
        { status }
      );
      res.send("connection request updated successfully!");
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
module.exports = connectionRequestRouter;

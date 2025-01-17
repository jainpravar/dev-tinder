const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const SAFE_USER_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "skills",
  "about",
  "photoUrl",
];

userRouter.get("/user/request/recived", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_FIELDS);
    res.json({
      message: "Data fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_FIELDS)
      .populate("toUserId", SAFE_USER_FIELDS);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "connections fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    let limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    let skip = (page - 1) * 10;
    limit = limit > 50 ? 50 : limit;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select(["fromUserId", "toUserId"]);

    const connectionsToHide = new Set();

    connections.forEach((req) => {
      connectionsToHide.add(req.fromUserId.toString());
      connectionsToHide.add(req.toUserId.toString());
    });

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(connectionsToHide) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(SAFE_USER_FIELDS)
      .skip(skip)
      .limit(limit);
    res.json({ message: "user feed", data: userFeed });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});
module.exports = userRouter;

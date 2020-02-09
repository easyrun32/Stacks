const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.use(express.json()); // Bug with Req.file going undefined

var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

router.get("/:id", (req, res) => {
  User.aggregate([
    {
      $match: {
        _id: ObjectId(req.params.id)
      }
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        name: "$name",
        profilelink: "$profilelink",
        description: "$description"
      }
    },
    {
      $lookup: {
        from: "projects",
        let: { id: "$_id" },
        pipeline: [{ $match: { $expr: { $eq: ["$owner.id", "$$id"] } } }],
        as: "projects"
      }
    }
  ]).then(user => {
    //Formating data
    const data = {
      user: {
        name: user[0].name,
        profilelink: user[0].profilelink,
        description: user[0].description
      },
      projects: user[0].projects
    };
    res.json(data);
  });
});

module.exports = router;

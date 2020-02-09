const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment");
router.use(express.json()); // Bug with Req.file going undefined

router.post("/", (req, res) => {
  Comment.find({ project_id: req.body.project_id }).then(comment => {
    res.send(comment);
  });
});

router.post("/postcomment", (req, res) => {
  const newComment = new Comment({
    name: req.body.username,
    userid: req.body.userid,
    project_id: req.body.project_id,
    comment: req.body.comment,
    profilelink: req.body.profilelink
  });
  newComment.save().then(user => {
    Comment.find({ project_id: user.project_id }).then(comment => {
      res.send(comment);
    });
  });
});

module.exports = router;

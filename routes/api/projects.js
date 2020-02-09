const express = require("express");
const router = express.Router();
const passport = require("passport");

const Project = require("../../models/Project");
const upload = require("../../photojs/multer");
const google = require("../../google/uploadgoogle");
const fs = require("fs");
const request = require("request");
const path = require("path");

router.use(express.json()); // Bug with Req.file going undefined

router.post(
  "/quicksetlink",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // x is just for naming the photo to be stored..
    let x = Math.floor(Math.random() * (50000000 - 20000000)) + 20000000;

    let filepath = "./data/" + x.toString() + ".jpeg";
    request(
      {
        url: "https://api.apiflash.com/v1/urltoimage",
        encoding: "binary",
        qs: {
          access_key: "57273a84e41a482fb6a3281f0b01a819",
          url: req.body.link
        }
      },
      (error, response, body) => {
        if (error) {
        } else {
          fs.writeFile(filepath, body, "binary", error => {
            //start

            const googlefolder = {
              file: req.user.email + "/" + x.toString()
            };
            const photolink =
              "https://storage.googleapis.com" +
              "/" +
              "stormybucket" +
              "/" +
              req.user.email +
              "/" +
              x.toString();

            //await fp.writeFile(filepath, body, "binary");

            //end of variables
            Project.findOneAndUpdate(
              { _id: req.body.project_id },
              { $addToSet: { link: photolink } },
              { new: true }
            ).then(projects => {
              google
                .uploadpicture(
                  "stormybucket",
                  googlefolder["file"],
                  "./" + `data/${x.toString()}.jpeg`
                )
                .then(bool => {
                  if (bool == true) {
                    //when bool is true then give a response to the client
                    res.json(projects);
                  }
                });
            });
            // end
          });
        }
      }
    );
  }
);

router.post("/setwebsite", (req, res) => {
  console.log(req.body.website);
  Project.findOneAndUpdate(
    { _id: req.body.project_id },
    { $set: { website: req.body.website } },
    {
      upsert: false,
      multi: true,
      new: true
    }
  ).then(project => {
    res.json(project);
  });
});

router.post("/setgithub", (req, res) => {
  console.log(req.body.github);
  Project.findOneAndUpdate(
    { _id: req.body.project_id },
    { $set: { github: req.body.github } },

    {
      upsert: false,
      multi: true,
      new: true
    }
  ).then(project => {
    res.json(project);
  });
});

router.get("/getall", (req, res) => {
  Project.aggregate([
    {
      $sort: {
        likes: -1
      }
    },
    {
      $group: {
        _id: {
          username: "$owner.email",
          name: "$owner.name",
          id: "$owner.id"
        },
        likedBy: {
          $push: "$likedBy"
        },
        likes: {
          $max: "$likes"
        },
        projectname: {
          $push: "$name"
        },
        projectid: {
          $push: "$_id"
        },
        link: {
          $push: "$link"
        },
        website: {
          $push: "$website"
        },
        github: {
          $push: "$github"
        }
      }
    },
    {
      $project: {
        username: "$_id.username",
        name: "$_id.name",
        projectname: {
          $arrayElemAt: ["$projectname", 0]
        },
        likedBy: {
          $arrayElemAt: ["$likedBy", 0]
        },
        link: {
          $arrayElemAt: ["$link", 0]
        },
        projectid: {
          $arrayElemAt: ["$projectid", 0]
        },
        website: {
          $arrayElemAt: ["$website", 0]
        },
        github: {
          $arrayElemAt: ["$github", 0]
        },
        likes: 1
      }
    }
  ])
    .then(project => {
      res.json(project);
    })
    .catch(err => {
      console.log(err);
    });
});

router.put(
  "/user/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.body.projectid).then(project => {
      if (req.user.email === project.owner.email) {
        console.log("you cannot like your own project");
        res.status(400).json({ error: "you cannot like your own project" });
      } else {
        if (project.likedBy.includes(req.user.email)) {
          console.log("you already liked this project so i'm disliking it");
          project.likes--;
          const arrayIndex = project.likedBy.indexOf(req.user.email);
          project.likedBy.splice(arrayIndex, 1);
          project.save(err => {
            if (err) {
              res
                .status(400)
                .json({ error: "something went wrong with disliking" });
            } else {
              //dislike
              Project.find({ "owner.id": req.body.ownerid }).then(project => {
                res.send(project);
              });
            }
          });
        } else {
          if (project.dislikedBy.includes(req.user.email)) {
            project.dislikes--;
            const arrayIndex = project.dislikedBy.indexOf(req.user.email);
            project.dislikedBy.splice(arrayIndex, 1);
            project.likes++;
            project.likedBy.push(req.user.email);
            project.save(err => {
              if (err) {
                console.log("something went wrong");
              } else {
                console.log("something went good");
              }
            });
          } else {
            project.likes++;
            project.likedBy.push(req.user.email);
            project.save((err, project) => {
              if (err) {
                console.log("something went wrong");
                res.status(400).json({ error: "something went wrong" });
              } else {
                //like
                Project.find({ "owner.id": req.body.ownerid }).then(project => {
                  res.send(project);
                });
              }
            });
          }
        }
      }
    });
  }
);

//https://www.youtube.com/watch?v=9LddH6JqsWw&t=238s
router.put(
  "/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.body.projectid);
    Project.findById(req.body.projectid).then(project => {
      if (req.user.email === project.owner.email) {
        console.log("you cannot like your own project");
        res.status(400).json({ error: "you cannot like your own project" });
      } else {
        if (project.likedBy.includes(req.user.email)) {
          console.log("you already liked this project so i'm disliking it");
          project.likes--;
          const arrayIndex = project.likedBy.indexOf(req.user.email);
          project.likedBy.splice(arrayIndex, 1);
          project.save(err => {
            if (err) {
              res
                .status(400)
                .json({ error: "something went wrong with disliking" });
            } else {
              Project.aggregate([
                {
                  $sort: {
                    likes: -1
                  }
                },
                {
                  $group: {
                    _id: {
                      username: "$owner.email",
                      name: "$owner.name",
                      id: "$owner.id"
                    },
                    likedBy: {
                      $push: "$likedBy"
                    },
                    likes: {
                      $max: "$likes"
                    },
                    projectname: {
                      $push: "$name"
                    },
                    projectid: {
                      $push: "$_id"
                    },
                    link: {
                      $push: "$link"
                    },
                    website: {
                      $push: "$website"
                    },
                    github: {
                      $push: "$github"
                    }
                  }
                },
                {
                  $project: {
                    username: "$_id.username",
                    name: "$_id.name",
                    projectname: {
                      $arrayElemAt: ["$projectname", 0]
                    },
                    likedBy: {
                      $arrayElemAt: ["$likedBy", 0]
                    },
                    link: {
                      $arrayElemAt: ["$link", 0]
                    },
                    projectid: {
                      $arrayElemAt: ["$projectid", 0]
                    },
                    website: {
                      $arrayElemAt: ["$website", 0]
                    },
                    github: {
                      $arrayElemAt: ["$github", 0]
                    },

                    likes: 1
                  }
                }
              ])
                .then(project => {
                  res.json(project);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
        } else {
          if (project.dislikedBy.includes(req.user.email)) {
            project.dislikes--;
            const arrayIndex = project.dislikedBy.indexOf(req.user.email);
            project.dislikedBy.splice(arrayIndex, 1);
            project.likes++;
            project.likedBy.push(req.user.email);
            project.save(err => {
              if (err) {
                console.log("something went wrong");
              } else {
                console.log("something went good");
              }
            });
          } else {
            project.likes++;
            project.likedBy.push(req.user.email);
            project.save((err, project) => {
              if (err) {
                console.log("something went wrong");
                res.status(400).json({ error: "something went wrong" });
              } else {
                Project.aggregate([
                  {
                    $sort: {
                      likes: -1
                    }
                  },
                  {
                    $group: {
                      _id: {
                        username: "$owner.email",
                        name: "$owner.name",
                        id: "$owner.id"
                      },
                      likedBy: {
                        $push: "$likedBy"
                      },
                      likes: {
                        $max: "$likes"
                      },
                      projectname: {
                        $push: "$name"
                      },
                      projectid: {
                        $push: "$_id"
                      },
                      link: {
                        $push: "$link"
                      },
                      website: {
                        $push: "$website"
                      },
                      github: {
                        $push: "$github"
                      }
                    }
                  },
                  {
                    $project: {
                      username: "$_id.username",
                      name: "$_id.name",
                      projectname: {
                        $arrayElemAt: ["$projectname", 0]
                      },
                      likedBy: {
                        $arrayElemAt: ["$likedBy", 0]
                      },
                      link: {
                        $arrayElemAt: ["$link", 0]
                      },
                      projectid: {
                        $arrayElemAt: ["$projectid", 0]
                      },

                      website: {
                        $arrayElemAt: ["$website", 0]
                      },
                      github: {
                        $arrayElemAt: ["$github", 0]
                      },
                      likes: 1
                    }
                  }
                ])
                  .then(project => {
                    res.json(project);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });
          }
        }
      }
    });
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let projectsArr = [];

    // Member projects
    await Project.find({})
      .then(projects => {
        projects.map(project => {
          project.teamMembers &&
            project.teamMembers.map(member => {
              if (member.email == req.user.email) {
                projectsArr.push(project);
              }
            });
        });
      })
      .catch(err => console.log(err));

    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    // Combine with owner projects
    await Project.find({ owner: OWNER })
      .then(projects => {
        let finalArr = [...projects, ...projectsArr];
        res.json(finalArr);
      })
      .catch(err => console.log(err));
  }
);

// @route GET api/projects/:id
// @desc Get specific project by id
// @access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    Project.findById(id).then(project => res.json(project));
  }
);

// @route POST api/projects/create
// @desc Create a new project
// @access Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    // console.log("this is owner", OWNER);
    const NEW_PROJECT = await new Project({
      owner: OWNER,
      name: req.body.projectName,
      teamMembers: req.body.members
    });
    // console.log("this is NEW_PROJECT", NEW_PROJECT);
    NEW_PROJECT.save().then(project => {
      res.json(project);
    });
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id).then(project => {
      project.link.forEach(el => {
        let new_str = el.slice(44, el.length);
        google.deletepicture("stormybucket", new_str);
        //format data for it to be deleted on server
        let url = new_str;
        let indexofurl = url.indexOf("/");
        let newurl = url.slice(indexofurl + 1, url.length);
        // looping through directory
        const directory = "data";
        fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            if (file === newurl) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                console.log(file, " has been deleted off the server");
              });
            }
          }
        }); //end of readdir
      }); // end of findById
      project.remove().then(() => res.json({ success: true }));
      //Project.findOneAndDelete(project).then(() => res.json({ success: true }));
    });
  }
);

router.patch(
  "/deletepicture/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let link = req.body.url.slice(44, req.body.url.length);
    console.log(link);
    Project.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { link: req.body.url } },
      { new: true }
    ).then(projects => {
      google.deletepicture("stormybucket", link);
      //easyrun32@gmail.com/wp2204403.jpg
      let url = link;
      let indexofurl = url.indexOf("/");
      let newurl = url.slice(indexofurl + 1, url.length);
      // looping through directory
      const directory = "data";
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          if (file === newurl) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err;
              console.log(file, " has been deleted off the server");
            });
          }
        }
      }); //end of readdir

      res.send(projects);
    });
  }
);

router.patch("/createpicture", upload.single("photolink"), (req, res) => {
  const googlefolder = {
    file: req.body.email + "/" + req.file.filename
  };

  const photolink =
    "https://storage.googleapis.com" +
    "/" +
    "stormybucket" +
    "/" +
    req.body.email +
    "/" +
    req.file.filename;

  Project.findOneAndUpdate(
    { _id: req.body._id },
    { $addToSet: { link: photolink } },
    { new: true }
  ).then(projects => {
    google
      .uploadpicture("stormybucket", googlefolder["file"], "./" + req.file.path)
      .then(bool => {
        if (bool == true) {
          //when bool is true then give a response to the client
          res.json(projects);
        }
      });
  });
});
// @route PATCH api/projects/update
// @desc Update an existing project
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let projectFields = {};

    projectFields.name = req.body.projectName;
    projectFields.teamMembers = req.body.members;

    Project.findOneAndUpdate(
      { _id: req.body.id },
      { $set: projectFields },
      { new: true }
    )
      .then(project => {
        res.json(project);
      })
      .catch(err => console.log(err));
  }
);

// @route DELETE api/projects/delete/:id
// @desc Delete an existing project
// @access Private

module.exports = router;

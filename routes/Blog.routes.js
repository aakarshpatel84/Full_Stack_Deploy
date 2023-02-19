const express = require("express");
const { BlogModel } = require("../models/Blog.model");
const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.send(blogs);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while getting all blog" });
  }
});

blogRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const blog = new BlogModel(payload);
    await blog.save();
    res.send({ msg: "Blog Created" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while posting blog" });
  }
});

blogRouter.delete("/delete/:id", async (req, res) => {
  const blogID = req.params.id;
  const Single_blog = await BlogModel.findOne({ _id: blogID });
  const userID_in_blog = Single_blog.user;
  const current_UserID = req.body.user;
  try {
    if (current_UserID !== userID_in_blog) {
      res.send({
        msg: "You are not authorized to delete this blog / you are not the owner of this blog",
      });
    } else {
      await BlogModel.findByIdAndDelete({ _id: blogID });
      res.send({ msg: `Blog w/ id:${blogID} has been deleted` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while Deleting blog" });
  }
});

blogRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const blogID = req.params.id;
  const Single_blog = await BlogModel.findOne({ _id: blogID });
  const userID_in_blog = Single_blog.user;
  const current_UserID = req.body.user;
  try {
    if (current_UserID !== userID_in_blog) {
      res.send({
        msg: "You are not authorized to update this blog / you are not the owner of this blog",
      });
    } else {
      await BlogModel.findByIdAndUpdate({ _id: blogID }, payload);
      res.send({ msg: `Blog w/ id:${blogID} has been Updated` });
    }
  } catch (error) {
    console.log(error);
    res.send({ msg: "Something went wrong while Updating blog" });
  }
});

module.exports = {
  blogRouter,
};

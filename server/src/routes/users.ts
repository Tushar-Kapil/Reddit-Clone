import { Request, Response, Router } from "express";
import Comments from "../entity/Comments";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import user from "../middlewares/user";

const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ["username", "createdAt"],
    });

    const posts = await Post.find({
      where: { user },
      relations: ["votes", "comments", "sub"],
    });

    const comments = await Comments.find({
      where: { user },
      relations: ["post"],
    });

    if (res.locals.user) {
      posts.forEach((post) => {
        post.setUserVote(res.locals.user);
      });
      comments.forEach((comment) => {
        comment.setUserVote(res.locals.user);
      });
    }

    let submissions: any[] = [];

    posts.forEach((p) => submissions.push({ type: "Post", ...p.toJSON() }));
    comments.forEach((c) =>
      submissions.push({ type: "Comment", ...c.toJSON() })
    );

    submissions.sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    });

    return res.json({ user, submissions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

export default router.get("/:username", user, getUserSubmissions);

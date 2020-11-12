import Post from "../models/Post";

import userView from "./users_view";

export default {
  render(post: Post) {
    //delete post.user.password;
    if (post.comments) {
      post.comments.forEach((post) => {
        //delete post.user.password;
      });
    }
    return {
      id: post.id,
      description: post.description,
      likes: post.likes,
      user: userView.render(post.user),
      comments: post.comments,
      url: `${process.env.API_URL}/uploads/${post.photo_path}`,
    };
  },
  renderMany(posts: Post[]) {
    return posts.map((post) => {
      //post.user.password = undefined;
      return this.render(post);
    });
  },
};

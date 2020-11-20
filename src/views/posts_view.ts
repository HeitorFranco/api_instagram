import IPost from "../interfaces/Post";

import userView from "./users_view";

export default {
  render(post: IPost) {
    //delete post.user.password;
    return {
      id: post.id,
      description: post.description,
      likes: post.likes,
      user: post.user ? userView.render(post.user) : undefined,
      comments: post.comments || [],
      url: `${process.env.API_URL}/uploads/${post.photo_path}`,
      myLike: post.myLike || undefined,
    };
  },
  renderMany(posts: IPost[]) {
    return posts.map((post) => {
      //post.user.password = undefined;
      return this.render(post);
    });
  },
};

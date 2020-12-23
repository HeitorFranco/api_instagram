import Like from "../models/Like";

import userView from "./users_view";
import postView from "./posts_view";

export default {
  render(like: Like) {
    return {
      id: like.id,
      post: postView.render(like.post),
      user: userView.render(like.user),
    };
  },
  renderMany(likes: Like[]) {
    return likes.map((like) => {
      return this.render(like);
    });
  },
};

import Like from "../models/Like";

import userView from "./users_view";
import postView from "./posts_view";

export default {
  render(like: Like) {
    //delete post.user.password;
    return {
      id: like.id,
      post: postView.render(like.post),
    };
  },
};

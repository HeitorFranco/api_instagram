import Post from "../models/Post";

export default interface IPost extends Post {
  myLike?: boolean;
}

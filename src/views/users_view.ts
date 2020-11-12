import User from "../models/User";

export default {
  render(user: User) {
    delete user.password;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo_url: `http://localhost:3333/uploads/${user.photo_path}`,
    };
  },
  renderMany(users: User[]) {
    return users.map((user) => {
      user.password = undefined;
      return this.render(user);
    });
  },
};

import { User } from '../models/user.model.js';
import { collections } from '../utils/db/connectToDb.js';
import { hashPassword } from '../utils/passwordUtils.js';

export async function isUsernameTaken(username: string): Promise<boolean> {
  const result = await collections.users?.findOne({username: username});
  if (result) {
    return true;
  } else {
    return false;
  }
}

export const registerUser = async (user: User) => {
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;
  // get profile pictures
  // https://avatar-placeholder.iran.liara.run/
  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${user.username}`;
  user.profilePic = user.gender === "male" ? boyProfilePic : girlProfilePic;

  const result = await collections.users?.insertOne(user);
  return result;
}
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
}

export async function isPasswordValid(userInputPassword: string, hashedPassword: string) {
  const isValid = await bcrypt.compare(userInputPassword, hashedPassword);
  return isValid;
}
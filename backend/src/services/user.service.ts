import * as mongodb from 'mongodb';

import { collections } from '../utils/db/connectToDb.js';

export async function fetchOtherUsers(loggedId: mongodb.ObjectId) {
  const result = await collections.users?.find({_id: {$ne: loggedId}}, { projection: { password: 0 } }).toArray();
  return result;
}
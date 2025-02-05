// Add timestamps - add createdAt and updateAt fileds to MongoDB documents
// expects an object and a false value if it is an update
export function addTimeStamps<T>(document: T, isNew: boolean = true): T & { createdAt?: Date; updatedAt: Date } {
  const now = new Date();
  return {
    ...document,
    ...(isNew && { createdAt: now }),
    updatedAt: now,
  };
}
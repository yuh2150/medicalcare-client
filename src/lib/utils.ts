// Utility functions for the application

/**
 * Get ID from object that might have either 'id' or '_id' property
 * @param obj Object with id or _id property
 * @returns string ID
 */
export function getId(obj: { id?: string; _id?: string }): string {
  return obj.id || obj._id || '';
}

/**
 * Transform API response object to include both id and _id for compatibility
 * @param obj Object from API response
 * @returns Object with both id and _id
 */
export function normalizeId<T extends { id?: string; _id?: string }>(obj: T): T & { id: string } {
  const id = getId(obj);
  return {
    ...obj,
    id,
    _id: obj._id || id
  };
}

/**
 * Transform array of API response objects to normalize IDs
 * @param items Array of objects from API response
 * @returns Array with normalized IDs
 */
export function normalizeIds<T extends { id?: string; _id?: string }>(items: T[]): (T & { id: string })[] {
  return items.map(normalizeId);
}

/**
 * Check if string is a valid MongoDB ObjectId
 * @param id String to check
 * @returns boolean
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

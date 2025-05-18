export function convertSnakeToCamelCase(obj) {
  const result = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );
      result[camelKey] = obj[key];
    }
  }

  return result;
}

const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

type AnyObject = Record<string, any>;

export const toCamelCaseKeys = <T extends AnyObject>(obj: AnyObject): T => {
  const result: AnyObject = {};

  for (const key in obj) {
    result[toCamelCase(key)] = obj[key];
  }

  return result as T;
};

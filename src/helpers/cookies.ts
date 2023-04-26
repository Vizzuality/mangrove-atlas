/**
 * Get a cookie value by key
 * @param key Cookie to retrieve
 */
export const getCookie = function (key: string): string {
  if (!key) return null;
  try {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${key}=`))
      ?.split('=')[1];
  } catch (err) {
    return null;
  }
};

/**
 * Set a cookie value by key
 * @param key Cookie key to set
 * @param value Cookie value to set
 */
export const setCookie = function (key: string, value: string): void {
  document.cookie = `${key}=${value}`;
};

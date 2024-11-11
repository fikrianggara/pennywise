export const setLocalStorageByKey = (key: string, value: string) => {
  console.log(key, value);
  localStorage.setItem(key, value);
};

export const getLocalStorageByKey = (key: string) => {
  return localStorage.getItem(key);
};

import queryString from 'query-string';

export const decodeUrlForState = url => {
  const paramsParsed = {};
  const params = queryString.parse(url);
  Object.keys(params).forEach(key => {
    try {
      paramsParsed[key] = JSON.parse(atob(params[key]));
    } catch (err) {
      paramsParsed[key] = params[key];
    }
  });

  return paramsParsed;
};

export const encodeStateForUrl = params => {
  const paramsParsed = {};
  Object.keys(params).forEach(key => {
    if (typeof params[key] === 'object') {
      paramsParsed[key] = btoa(JSON.stringify(params[key]));
    } else {
      paramsParsed[key] = params[key];
    }
  });

  return queryString.stringify(paramsParsed);
};

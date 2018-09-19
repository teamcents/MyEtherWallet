function post(url = ``, data = {}, opts = {}) {
  const defaultOptions = {
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  };
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'POST' }
  };
  return fetch(url, options).then(response => response.json()); // parses response to JSON
}

function get(url = ``, opts = {}) {
  const defaultOptions = {
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache' // *default, no-cache, reload, force-cache, only-if-cached
  };
  const options = {
    ...defaultOptions,
    ...opts,
    ...{ method: 'GET' }
  };
  return fetch(url, options).then(response => response.json()); // parses response to JSON
}

export { get, post };

var request = {};
request.get = function(url) {
  return fetch(url)
    .then((response)=>response.json())
};

request.post = function(url,body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then((response)=>response.json())
};

module.exports = request;
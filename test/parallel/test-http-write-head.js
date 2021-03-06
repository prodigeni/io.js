var common = require('../common');
var assert = require('assert');
var http = require('http');

// Verify that ServerResponse.writeHead() works as setHeader.
// Issue 5036 on github.

var s = http.createServer(function(req, res) {
  res.setHeader('test', '1');

  // toLowerCase() is used on the name argument, so it must be a string.
  var threw = false;
  try {
    res.setHeader(0xf00, 'bar');
  } catch (e) {
    assert.ok(e instanceof TypeError);
    threw = true;
  }
  assert.ok(threw, 'Non-string names should throw');

  res.writeHead(200, { Test: '2' });
  res.end();
});

s.listen(common.PORT, runTest);

function runTest() {
  http.get({ port: common.PORT }, function(response) {
    response.on('end', function() {
      assert.equal(response.headers['test'], '2');
      assert(response.rawHeaders.indexOf('Test') !== -1);
      s.close();
    });
    response.resume();
  });
}

let Parsimmon = require("parsimmon");

const parser = Parsimmon.string("foo").map(function(x) {
  return x + "bar";
});

const inputNode = document.getElementById("input");

setInterval(function() {
  const result = parser.parse(inputNode.value);
  document.getElementById("output").textContent = JSON.stringify(result);
}, 1000);

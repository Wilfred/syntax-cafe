let P = require("parsimmon");

const parser = P.createLanguage({
  Program: r =>
    r.Value.sepBy(r._)
      .trim(r._)
      .node("Program"),
  Value: function(r) {
    return P.alt(r.Number, r.Symbol, r.String, r.List);
  },
  Number: function() {
    return P.regexp(/[0-9]+/).map(Number);
  },
  Symbol: function() {
    return P.regexp(/[a-z]+/);
  },
  String: function() {
    return P.regexp(/"((?:\\.|.)*?)"/, 1);
  },
  List: function(r) {
    return P.string("(")
      .then(r.Value.sepBy(r._))
      .skip(P.string(")"));
  },
  _: function() {
    return P.optWhitespace;
  }
});

const inputNode = document.getElementById("input");

setInterval(function() {
  const result = parser.Program.parse(inputNode.value);
  document.getElementById("output").textContent = JSON.stringify(
    result,
    null,
    "  "
  );
}, 300);

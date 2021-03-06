/**
 * Created by romain.lenzotti on 21/07/2017.
 */
"use strict";
const {writeSymbol, writeIndex} = require("./write");
const template = require("./template");
const scan = require("./scan");
const path = require("path");

const {$log} = require("ts-log-debug");

$log.name = "DOC";

const options = {
  file: path.resolve(__dirname + "/../api/index.md"),
  pattern: __dirname + "/../../lib/**/*.ts"
};

Promise.resolve()
  .then(() => scan(options.pattern))
  .then(docComponents => {

    docComponents.forEach(docComponents => {
      docComponents.symbols.forEach((symbol) => {
        writeSymbol(Object.assign(symbol, {output: template(symbol)}));
      });
    });
  })
  .then(() => {
    writeIndex();
  })
  .then(() => $log.info("done"))
  .catch(err => console.error(err));
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const hostPath = path.join(root, "src", "host.js");
const entries = ["g1-acq.js", "g1-sku-report.js"];

function bundle(name) {
  const host = fs.readFileSync(hostPath, "utf8").trimEnd();
  const entry = fs.readFileSync(path.join(root, "src", name), "utf8").trimEnd();
  return [
    "/* @generated from src/host.js and src/" + name + ". Edit sources, then run: node scripts/build.cjs */",
    host,
    "",
    entry,
    ""
  ].join("\n");
}

function build() {
  return Object.fromEntries(entries.map(name => [name, bundle(name)]));
}

function writeBuild() {
  const output = build();
  for (const name of entries) {
    fs.writeFileSync(path.join(root, name), output[name]);
  }
  return output;
}

if (require.main === module) {
  const check = process.argv.includes("--check");
  const output = check ? build() : writeBuild();
  if (check) {
    for (const name of entries) {
      const published = fs.readFileSync(path.join(root, name), "utf8");
      if (published !== output[name]) {
        console.error(name + " does not match src/. Run: node scripts/build.cjs");
        process.exit(1);
      }
    }
  }
}

module.exports = { build, writeBuild };

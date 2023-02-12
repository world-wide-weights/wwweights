// This could also be done as a shell script, but that would not allow windiws devs to execute it
// Args:
// 1. localhost port (defaults to 3002. To see why this script only works against localhost see README)
// 2. filepath (defaults to sample data)
// 3. chunksize (defaults all at once)

const { readFileSync, existsSync } = require("fs");

function readJSON(filepath) {
  if (!existsSync(filepath)) {
    throw new Error("File could not be found");
  }
  const rawData = readFileSync(filepath).toString('utf-8');
  return JSON.parse(rawData)
}

function splitIntoChunks(data, chunkSize) {
  const count = 0;
  const res = [];
  while (count < data.length) {
    res.concat(data.slice(count, count + chunkSize));
    count += chunkSize;
  }
  return res;
}

async function sendData(port, data) {
  console.log(`http://localhost:${port}/commands/v1/items/bulk-insert`)
  const res = await fetch(`http://localhost:${port}/commands/v1/items/bulk-insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  // Is reponse ok?
  if (res.status !== 200) {
    throw new Error(`Request failed with statuscode ${res.status}`);
  }
}

async function main(opts) {
  const data = readJSON(opts.filePath);
  console.log(`Found json with ${data.length} entries`);
  let chunks = [data];
  if (opts.chunkSize !== -1) {
    chunks = splitIntoChunks(data, opts.chunkSize);
  }
  let count = 0;
  for (const chunk of chunks) {
    console.log(`Inserting chunk ${count}/${chunks.length}`);
    await sendData(opts.port, chunk);
  }
  console.log("Data inserted!");
}

const opts = {
  port: +process.argv.at(2) || 3002,
  filePath: process.argv.at(3) || "./data/sample.json",
  chunkSize: process.argv.at(4) || -1,
};

main(opts);

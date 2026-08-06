import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as OpenCC from "opencc-js";

const root = path.resolve("public/notes/fall-recruiting");
const convert = OpenCC.Converter({ from: "cn", to: "hk" });
const files = (await readdir(root)).filter((name) => name.endsWith(".md") && !/\.(?:tw|en)\.md$/.test(name));

for (const file of files) {
  const source = await readFile(path.join(root, file), "utf8");
  await writeFile(path.join(root, file.replace(/\.md$/, ".tw.md")), convert(source), "utf8");
}
console.log(`Generated ${files.length} Hong Kong Traditional Chinese notes.`);

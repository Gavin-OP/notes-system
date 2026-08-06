import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("public/notes/fall-recruiting");
const sourceFiles = (await readdir(root)).filter((name) => name.endsWith(".md") && !/\.(?:tw|en)\.md$/.test(name));
const errors = [];
for (const sourceName of sourceFiles) {
  for (const locale of ["tw", "en"]) {
    const localizedName = sourceName.replace(/\.md$/, `.${locale}.md`);
    const localizedPath = path.join(root, localizedName);
    try {
      await access(localizedPath);
      const content = await readFile(localizedPath, "utf8");
      if (!content.includes("---") || !content.includes("# ")) errors.push(`${localizedName}: invalid Markdown structure`);
    } catch {
      errors.push(`${localizedName}: missing`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Verified ${sourceFiles.length * 2} static locale files.`);

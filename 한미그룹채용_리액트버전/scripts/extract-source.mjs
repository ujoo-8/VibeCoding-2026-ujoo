import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function extractScriptJson(id) {
  const re = new RegExp(
    `<script type="application/json" id="${id}">([\\s\\S]*?)</script>`,
  );
  const match = html.match(re);
  if (!match) throw new Error(`Missing ${id}`);
  const data = JSON.parse(match[1]);
  return data;
}

function extractWindowJson(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/window\.HANMI_WALK_DATA\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!match) throw new Error(`No HANMI_WALK_DATA in ${filePath}`);
  return JSON.parse(match[1]);
}

const taskData = extractScriptJson("task-data");
const popupData = extractScriptJson("popup-data");
fs.writeFileSync(
  path.join(root, "src/data/taskData.json"),
  JSON.stringify(taskData, null, 2),
);
fs.writeFileSync(
  path.join(root, "src/data/popupData.json"),
  JSON.stringify(popupData, null, 2),
);

const walkingMeta = extractWindowJson(
  path.join(root, "hanmi-eye-tracking/hanmi-eye-tracking/metadata.js"),
);
const readingMeta = extractWindowJson(
  path.join(root, "hanmi-reading-eye-tracking/metadata-v3.js"),
);
fs.writeFileSync(
  path.join(root, "public/hanmi-eye-tracking/metadata.json"),
  JSON.stringify(walkingMeta),
);
fs.writeFileSync(
  path.join(root, "public/hanmi-reading-eye-tracking/metadata.json"),
  JSON.stringify(readingMeta),
);

const cssPath = path.join(root, "src/styles/main.css");
let css = fs.readFileSync(cssPath, "utf8");
css = css.replace(
  `@import url("../data/hanmi-eye-tracking/player.css");
@import url("../data/hanmi-reading-eye-tracking/player.css");
`,
  "",
);
css = css.replaceAll('url("../images/', 'url("/images/');
fs.writeFileSync(cssPath, css);

console.log({
  taskCategories: taskData.length,
  popupJobs: popupData.length,
  walkingFrames: walkingMeta.count,
  readingFrames: readingMeta.count,
});

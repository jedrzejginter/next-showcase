const fs = require("fs");
const glob = require("glob");
const path = require("path");

const paths = glob.sync("src/**/*.stories.tsx");

const x = paths.map((p) => {
  const modName = path.dirname(p).replace(/.*src\//, "");
  const importName = modName.replace("/", "__");

  return { name: importName, source: `@/${p.replace(/.*src\//, "").replace(/\.tsx?$/, "")}` };
});

const file = `
import Showcase from "./lib/Showcase";

const storiesLoaders = {
${x
  .map((y) => {
    return `  "${y.name}": () => import("${y.source}"),`;
  })
  .join("\n")}
};

export default function ShowcasePage() {
  return (
    <Showcase storiesLoaders={storiesLoaders} />
  );
}
`;

// written in process.cwd() context
fs.writeFileSync("pages/showcase.tsx", file.trim(), "utf-8");

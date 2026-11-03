import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function htmlToJsx(source) {
  let jsx = source;
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, (_m, comment) => {
    const text = comment.replace(/\*\//g, "* /").trim();
    return `{/* ${text} */}`;
  });
  jsx = jsx.replace(/\sclass=/g, " className=");
  jsx = jsx.replace(/\stabindex=/g, " tabIndex=");
  jsx = jsx.replace(/\sstroke-width=/g, " strokeWidth=");
  jsx = jsx.replace(/\sstroke-linecap=/g, " strokeLinecap=");
  jsx = jsx.replace(/\sstroke-linejoin=/g, " strokeLinejoin=");
  jsx = jsx.replace(/\sclip-path=/g, " clipPath=");
  jsx = jsx.replace(/\sfill-rule=/g, " fillRule=");
  jsx = jsx.replace(/\sclip-rule=/g, " clipRule=");
  jsx = jsx.replace(/src="\.\//g, 'src="/');
  jsx = jsx.replace(/href="\.\/"/g, 'href="/"');
  jsx = jsx.replace(/<(img|br|input|hr)([^>]*?)\s*\/?>/gi, "<$1$2 />");
  jsx = jsx.replace(/\s\/> \/>/g, " />");
  return jsx.trim();
}

function extractById(id) {
  const start = html.indexOf(`id="${id}"`);
  if (start < 0) throw new Error(id);
  const sectionStart = html.lastIndexOf("<section", start);
  let depth = 0;
  const slice = html.slice(sectionStart);
  const tagRe = /<\/?section\b[^>]*>/g;
  let match;
  let end = 0;
  while ((match = tagRe.exec(slice))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      end = match.index + match[0].length;
      break;
    }
  }
  return slice.slice(0, end);
}

function extractFooter() {
  const start = html.indexOf('<footer class="footer">');
  const end = html.indexOf("</footer>", start) + "</footer>".length;
  return html.slice(start, end);
}

function writeComponent(fileName, componentName, jsx, extraImport = "") {
  const contents = `${extraImport}export default function ${componentName}() {
  return (
    ${jsx}
  );
}
`;
  fs.writeFileSync(path.join(root, "src/components", fileName), contents);
}

writeComponent("HistorySection.jsx", "HistorySection", htmlToJsx(extractById("history")));
writeComponent("JobsSection.jsx", "JobsSection", htmlToJsx(extractById("jobs")));
writeComponent("NewsSection.jsx", "NewsSection", htmlToJsx(extractById("news")));
writeComponent("MoreLinksSection.jsx", "MoreLinksSection", htmlToJsx(html.match(/<section class="con8"[\s\S]*?<\/section>/)[0]));
writeComponent("Footer.jsx", "Footer", htmlToJsx(extractFooter()));

console.log("generated static section components");

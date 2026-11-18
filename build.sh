#!/bin/sh
# build.sh — inlines engine.js, sandhya.js, mudra_rig.js, indic.js, mantras_te.js, sankalpam_te.js,
#            places.js, ui.js (+ places_abroad.js, deities.js, local_rivers.js, ui_i18n.js,
#            names_i18n.js, places_te.js when present) into
# template.html and writes two outputs:
#   panchangam.html        a single-file copy of the page, without a <head> (for embedding)
#   site/public/index.html the website: a full HTML document with head, share tags, app
#                          manifest and icons, and a base CSS reset
# The `export` keywords are stripped so the modules run as plain inline script. mudra_rig.js is wrapped
# in its own function scope (as MR), and the Telugu-script modules in theirs (only their exports are
# visible), so their internal names (KESAVADI, TITHI …) cannot clash with sandhya.js or engine.js.
# Deploy: cd site && npx -y firebase-tools@13 deploy --only hosting --project <your-firebase-project>
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
node -e '
const fs = require("fs"), path = require("path");
const dir = process.argv[1];
const has = (f) => fs.existsSync(path.join(dir, f));
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8").replace(/^export /gm, "");
const opt = (f) => (has(f) ? "\n" + read(f) : "");
const places = read("places.js") + opt("places_abroad.js") + opt("deities.js") + opt("local_rivers.js")
  + "\n" + read("ui.js") + opt("ui_i18n.js") + opt("names_i18n.js");
const rig = "\nconst MR = (() => {\n" + read("mudra_rig.js")
  + "\nreturn { MUDRA_POSES, resolvePose, blendPose, mudraSvg };\n})();\n";
// A module in its own scope; its exports (export const/function NAME) become page-level names.
const scoped = (f) => {
  const raw = fs.readFileSync(path.join(dir, f), "utf8");
  const names = [...raw.matchAll(/^export (?:const|let|function) ([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
  return `\nconst { ${names.join(", ")} } = (() => {\n${read(f)}\nreturn { ${names.join(", ")} };\n})();\n`;
};
const scripts = scoped("indic.js") + scoped("mantras_te.js") + scoped("sankalpam_te.js") + (has("places_te.js") ? scoped("places_te.js") : "");
const page = read("template.html").replace("/*ENGINE*/", () => read("engine.js"))
  .replace("/*SANDHYA*/", () => read("sandhya.js") + rig + scripts).replace("/*PLACES*/", () => places);
fs.writeFileSync(path.join(dir, "panchangam.html"), page);
console.log("wrote panchangam.html", page.length, "bytes");

// Website: everything before the <!--page--> marker (title, fonts, styles) goes in <head>.
const cut = page.indexOf("<!--page-->");
if (cut < 0) throw new Error("build.sh: <!--page--> marker not found in template.html");
const head = page.slice(0, cut).replace("<title>Telugu Panchangam</title>", "<title>Sankalpam · Telugu Panchangam</title>");
const desc = "Daily Telugu panchangam, sankalpam and Yajurveda sandhyavandanam for your town: tithi, nakshatram, Rahu kaalam, and a ready sankalpam with your gotram.";
const site = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="${desc}">
<meta property="og:title" content="Sankalpam · Telugu Panchangam">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://telugu-sankalpam.web.app/icon-512.png">
<meta name="theme-color" content="#E1E5F1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Sankalpam">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>
:root { padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; }
[hidden] { display: none !important; }
img { max-width: 100%; }
</style>
${head}
</head>
<body>
${page.slice(cut)}
</body>
</html>
`;
const pub = path.join(dir, "site/public");
fs.mkdirSync(pub, { recursive: true });
fs.writeFileSync(path.join(pub, "index.html"), site);
fs.writeFileSync(path.join(pub, "manifest.webmanifest"), JSON.stringify({
  name: "Sankalpam · Telugu Panchangam", short_name: "Sankalpam", start_url: "/", scope: "/",
  display: "standalone", background_color: "#F3EEE6", theme_color: "#E1E5F1", description: desc,
  icons: [
    { src: "icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
  ],
}, null, 2));
console.log("wrote site/public/index.html", site.length, "bytes, and manifest.webmanifest");
' "$DIR"

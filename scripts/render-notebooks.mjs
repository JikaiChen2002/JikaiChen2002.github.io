import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const markedModule = "C:/Users/ROG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js";
const { marked } = await import(pathToFileURL(markedModule).href);

const root = path.resolve(import.meta.dirname, "..");
const notebookDir = path.join(root, "resources", "deep-learning", "notebooks");
const outputDir = path.join(root, "resources", "deep-learning", "notebook-html");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sourceText(cell) {
  return Array.isArray(cell.source) ? cell.source.join("") : (cell.source || "");
}

function stripAnsi(text) {
  return String(text).replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
}

function renderOutput(output) {
  if (output.output_type === "stream") {
    const text = Array.isArray(output.text) ? output.text.join("") : (output.text || "");
    return `<pre class="output-text">${escapeHtml(stripAnsi(text))}</pre>`;
  }

  if (output.output_type === "error") {
    const traceback = Array.isArray(output.traceback) ? output.traceback.join("\n") : (output.evalue || "Error");
    return `<pre class="output-text output-error">${escapeHtml(stripAnsi(traceback))}</pre>`;
  }

  const data = output.data || {};
  if (data["image/png"]) {
    return `<div class="output-image"><img src="data:image/png;base64,${data["image/png"]}" alt="Notebook output"></div>`;
  }
  if (data["image/jpeg"]) {
    return `<div class="output-image"><img src="data:image/jpeg;base64,${data["image/jpeg"]}" alt="Notebook output"></div>`;
  }
  if (data["text/plain"]) {
    const text = Array.isArray(data["text/plain"]) ? data["text/plain"].join("") : data["text/plain"];
    return `<pre class="output-text">${escapeHtml(stripAnsi(text))}</pre>`;
  }
  return "";
}

function renderCell(cell) {
  if (cell.cell_type === "markdown") {
    return `<section class="cell markdown-cell">${marked.parse(sourceText(cell))}</section>`;
  }

  if (cell.cell_type === "code") {
    const count = cell.execution_count ?? " ";
    const outputs = (cell.outputs || []).map(renderOutput).filter(Boolean).join("\n");
    return `
      <section class="cell code-cell">
        <div class="prompt">In&nbsp;[${escapeHtml(count)}]</div>
        <pre class="code"><code>${escapeHtml(sourceText(cell))}</code></pre>
        ${outputs ? `<div class="outputs">${outputs}</div>` : ""}
      </section>`;
  }

  return "";
}

function notebookTitle(notebook, fallback) {
  for (const cell of notebook.cells || []) {
    if (cell.cell_type !== "markdown") continue;
    const match = sourceText(cell).match(/^#\s+(.+)$/m);
    if (match) return match[1].replaceAll("*", "").trim();
  }
  return fallback;
}

function pageTemplate(title, notebookFile, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · Jikai Chen</title>
  <meta name="description" content="Static online reading version of ${escapeHtml(title)}.">
  <style>
    :root { color-scheme: light dark; --bg:#fff; --text:#1c2230; --muted:#697386; --accent:#5b2d8e; --rule:#e4e1ea; --code:#f6f4f8; --output:#fbfafc; }
    @media (prefers-color-scheme: dark) { :root { --bg:#16141b; --text:#ebe9f1; --muted:#aaa5b4; --accent:#c2a5ec; --rule:#302b3a; --code:#211e28; --output:#1b1821; } }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif; }
    a { color:var(--accent); }
    header { border-bottom:1px solid var(--rule); }
    .wrap { max-width:980px; margin:0 auto; padding:18px 24px; }
    header .wrap { display:flex; justify-content:space-between; gap:18px; flex-wrap:wrap; }
    main { max-width:980px; margin:0 auto; padding:28px 24px 70px; }
    h1 { font-size:34px; line-height:1.2; margin:22px 0; }
    h2 { font-size:26px; margin-top:38px; border-bottom:1px solid var(--rule); padding-bottom:6px; }
    h3 { font-size:21px; margin-top:30px; }
    .cell { margin:18px 0; }
    .markdown-cell p, .markdown-cell li { max-width:78ch; }
    .code-cell { display:grid; grid-template-columns:70px 1fr; gap:10px; align-items:start; }
    .prompt { color:var(--muted); font:13px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace; padding-top:12px; text-align:right; }
    pre { margin:0; overflow:auto; white-space:pre-wrap; word-break:break-word; }
    .code { padding:14px 16px; border:1px solid var(--rule); border-radius:6px; background:var(--code); font:14px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace; }
    .outputs { grid-column:2; margin-top:-2px; }
    .output-text { padding:12px 16px; border-left:3px solid var(--rule); background:var(--output); font:14px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace; }
    .output-error { border-left-color:#b42318; color:#b42318; }
    .output-image img { max-width:100%; height:auto; display:block; }
    table { border-collapse:collapse; display:block; overflow:auto; }
    th, td { border:1px solid var(--rule); padding:7px 10px; }
    blockquote { margin-left:0; padding-left:16px; border-left:3px solid var(--rule); color:var(--muted); }
    .notice { color:var(--muted); font-size:14px; margin:0 0 28px; }
    @media (max-width:640px) { .code-cell { grid-template-columns:1fr; } .prompt { text-align:left; padding:0; } .outputs { grid-column:1; } main { padding-left:14px; padding-right:14px; } }
  </style>
  <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
  <header><div class="wrap"><a href="../../../learning.html">← Back to Learning</a><a href="../notebooks/${encodeURIComponent(notebookFile)}" download>Download notebook</a></div></header>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p class="notice">Static reading version. Download the original notebook to run or modify the code.</p>
    ${content}
  </main>
</body>
</html>`;
}

await fs.mkdir(outputDir, { recursive: true });
const files = (await fs.readdir(notebookDir)).filter((name) => name.endsWith(".ipynb")).sort();

for (const file of files) {
  const notebook = JSON.parse(await fs.readFile(path.join(notebookDir, file), "utf8"));
  const fallback = path.basename(file, ".ipynb").replaceAll("_", " ");
  const title = notebookTitle(notebook, fallback);
  const content = (notebook.cells || []).map(renderCell).join("\n");
  const output = path.join(outputDir, `${path.basename(file, ".ipynb")}.html`);
  await fs.writeFile(output, pageTemplate(title, file, content), "utf8");
  console.log(`Rendered ${file} -> ${path.relative(root, output)}`);
}

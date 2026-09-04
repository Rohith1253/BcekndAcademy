const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mdPath = path.join(__dirname, '..', 'FINAL_PROJECT_AUDIT_REPORT.md');
const htmlPath = path.join(__dirname, '..', 'FINAL_PROJECT_AUDIT_REPORT.html');
const pdfPath = path.join(__dirname, '..', 'FINAL_PROJECT_AUDIT_REPORT.pdf');

const md = fs.readFileSync(mdPath, 'utf8');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  const html = [];
  let inCodeBlock = false;
  let codeContent = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;

  function flushTable() {
    if (!inTable) return;
    if (tableRows.length === 0) {
      inTable = false;
      return;
    }
    let tableHtml = '<div class="table-wrapper"><table>\n';
    tableRows.forEach((row, idx) => {
      // Check if it's separator row
      if (row.every(c => /^[-:| ]+$/.test(c))) return;

      const tag = idx === 0 ? 'th' : 'td';
      tableHtml += '  <tr>\n';
      row.forEach(cell => {
        let cellText = formatInline(cell.trim());
        if (cellText === 'PASS') {
          cellText = '<span class="badge badge-pass">PASS</span>';
        } else if (cellText === 'FAIL') {
          cellText = '<span class="badge badge-fail">FAIL</span>';
        } else if (cellText === 'WARNING' || cellText === 'PASS WITH WARNINGS') {
          cellText = '<span class="badge badge-warn">WARNING</span>';
        }
        tableHtml += `    <${tag}>${cellText}</${tag}>\n`;
      });
      tableHtml += '  </tr>\n';
    });
    tableHtml += '</table></div>\n';
    html.push(tableHtml);
    tableRows = [];
    inTable = false;
  }

  function flushList() {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  }

  function formatInline(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre class="code-box"><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
        codeContent = [];
        inCodeBlock = false;
      } else {
        flushTable();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.trim().slice(1, -1).split('|');
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Horizontal Rule
    if (/^---{1,}$/.test(line.trim())) {
      flushList();
      html.push('<hr class="divider" />');
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      html.push(`<h1 class="doc-title">${formatInline(line.slice(2).trim())}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      html.push(`<h2 class="section-title">${formatInline(line.slice(3).trim())}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      html.push(`<h3 class="subsection-title">${formatInline(line.slice(4).trim())}</h3>`);
      continue;
    }

    // Unordered lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (!inList) {
        html.push('<ul class="doc-list">');
        inList = true;
      }
      html.push(`  <li>${formatInline(line.trim().slice(2))}</li>`);
      continue;
    } else {
      flushList();
    }

    // Blank line
    if (!line.trim()) {
      continue;
    }

    // Normal paragraph
    html.push(`<p class="doc-p">${formatInline(line.trim())}</p>`);
  }

  flushTable();
  flushList();
  if (inCodeBlock) {
    html.push(`<pre class="code-box"><code>${escapeHtml(codeContent.join('\n'))}</code></pre>`);
  }

  return html.join('\n');
}

const bodyHtml = parseMarkdown(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Backend Academy — Final Full Project Audit Report</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.55;
      font-size: 11pt;
      padding: 0;
    }
    .header-banner {
      background: linear-gradient(135deg, #090d1f 0%, #172554 100%);
      color: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
    }
    .header-banner h1 {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #38bdf8;
      margin-bottom: 8px;
    }
    .header-banner p {
      color: #cbd5e1;
      font-size: 9.5pt;
      margin: 3px 0;
    }
    .score-badge {
      display: inline-block;
      background: #22c55e;
      color: #ffffff;
      padding: 4px 14px;
      border-radius: 9999px;
      font-weight: 800;
      font-size: 13pt;
      margin-top: 8px;
      letter-spacing: 0.5px;
    }
    h1.doc-title {
      display: none; /* Already rendered in banner */
    }
    h2.section-title {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 22px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3.subsection-title {
      font-size: 11.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p.doc-p {
      margin-bottom: 8px;
      color: #334155;
      font-size: 10pt;
    }
    .divider {
      border: 0;
      height: 1px;
      background: #e2e8f0;
      margin: 18px 0;
    }
    .table-wrapper {
      margin: 12px 0 16px 0;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #cbd5e1;
    }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-pass {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    .badge-fail {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    .badge-warn {
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .code-box {
      background: #090d1f;
      color: #e2e8f0;
      padding: 12px 14px;
      border-radius: 8px;
      font-family: Consolas, "Courier New", Courier, monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      margin: 12px 0;
      overflow-x: auto;
      page-break-inside: avoid;
      border: 1px solid #1e293b;
    }
    code {
      font-family: Consolas, "Courier New", Courier, monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 9pt;
      border: 1px solid #e2e8f0;
    }
    pre code {
      background: transparent;
      padding: 0;
      border: 0;
      color: inherit;
    }
    ul.doc-list {
      margin: 6px 0 10px 20px;
      font-size: 10pt;
      color: #334155;
    }
    ul.doc-list li {
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #cbd5e1;
      font-size: 8.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>BACKEND ACADEMY — AUDIT REPORT</h1>
    <p><strong>Date of Audit:</strong> September 4, 2026 &nbsp;|&nbsp; <strong>Status:</strong> PRODUCTION READY</p>
    <p><strong>Auditor Roles:</strong> Senior Full Stack Engineer, QA Engineer, Security Reviewer, Production Readiness Auditor</p>
    <p><strong>Target Architecture:</strong> Next.js 16 (App Router), React 19, TypeScript, Node.js, Express, MongoDB, Google Gemini AI</p>
    <div class="score-badge">PRODUCTION READINESS: 98 / 100 (PASSED)</div>
  </div>

  ${bodyHtml}

  <div class="footer">
    <span>Backend Academy &copy; 2026 — Comprehensive Production Readiness Audit</span>
    <span>Generated on September 4, 2026</span>
  </div>
</body>
</html>
`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('✅ Generated HTML report:', htmlPath);

// Locate Chrome or Edge
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

let browserPath = chromePaths.find(p => fs.existsSync(p));

if (!browserPath) {
  console.error('❌ Neither Google Chrome nor Microsoft Edge was found on system.');
  process.exit(1);
}

console.log('Using browser executable for PDF conversion:', browserPath);

const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;
console.log('Running print command...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log('🎉 Successfully generated PDF Report!');
  console.log('File:', pdfPath);
  console.log('Size:', (stats.size / 1024).toFixed(1), 'KB');
} else {
  console.error('❌ PDF file was not created.');
  process.exit(1);
}

const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333; // Use a fresh debugging port
const BASE_URL = 'http://localhost:3001';

const VIEWPORTS = [
  { name: 'Mobile (375x667)', width: 375, height: 667 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  { path: '/backend-languages', title: 'Languages Matrix' },
  { path: '/backend-languages/python', title: 'Python Detail' },
  { path: '/backend-languages/go', title: 'Go Detail' },
  { path: '/backend-languages/rust', title: 'Rust Detail' },
  { path: '/backend-languages/compare?lang1=go&lang2=rust', title: 'Go vs Rust Compare' },
  { path: '/courses', title: 'Course Catalog' },
  { path: '/dashboard', title: 'Dashboard' },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPageWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        const page = list.find((item) => item.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch (e) {}
    await sleep(200);
  }
  throw new Error('Failed to find Page target in Chrome');
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async init() {
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    this.ws.close();
  }
}

async function runBrowserTests() {
  console.log('=== STARTING HEADLESS CHROME MULTI-LANGUAGE TEST SUITE ===');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1440,900',
    'about:blank',
  ]);

  try {
    const wsUrl = await getPageWsUrl();
    console.log('Connected to Chrome DevTools Protocol at:', wsUrl);

    const cdp = new CDPClient(wsUrl);
    await cdp.init();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    let allPassed = true;

    for (const vp of VIEWPORTS) {
      console.log(`\n------------------------------------------------------------`);
      console.log(`VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`------------------------------------------------------------`);

      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768,
      });

      for (const page of PAGES_TO_TEST) {
        const url = `${BASE_URL}${page.path}`;
        await cdp.send('Page.navigate', { url });
        await sleep(1000);

        // Evaluate DOM diagnostics
        const evalRes = await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasHorizontalScroll = scrollWidth > innerWidth + 2;
            const h1 = document.querySelector('h1')?.innerText || '';
            const cardCount = document.querySelectorAll('.course-card, [class*="rounded-xl"]').length;
            const errorText = document.body.innerText.includes('Application error') || document.body.innerText.includes('Unhandled Runtime Error');
            return {
              title: document.title,
              h1,
              scrollWidth,
              innerWidth,
              hasHorizontalScroll,
              cardCount,
              errorText,
            };
          })()`,
          returnByValue: true,
        });

        const data = evalRes.result?.value || {};
        const isOk = !data.errorText && !data.hasHorizontalScroll;
        if (!isOk) allPassed = false;

        const statusLabel = isOk ? 'PASS' : 'FAIL';
        console.log(`[${statusLabel}] ${page.title} (${page.path})`);
        console.log(`       H1: "${data.h1.replace(/\n/g, ' ')}" | Overflow: ${data.hasHorizontalScroll} | Error: ${data.errorText}`);
      }
    }

    await cdp.close();
    console.log(`\n============================================================`);
    console.log(allPassed ? '>>> ALL BROWSER RUNTIME VERIFICATIONS PASSED 100% <<<' : '>>> SOME TESTS FAILED <<<');
    console.log(`============================================================`);
  } finally {
    chromeProc.kill();
  }
}

runBrowserTests().catch(console.error);

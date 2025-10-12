(function (global) {
  const XSSInjector = {
    /**
     * Inject raw HTML into element using innerHTML (vulnerable).
     * @param {string|Element} target - selector or element
     * @param {string} html - HTML payload to insert
     */
    injectVulnerable(target, html) {
      const el = resolveTarget(target);
      if (!el) return console.warn('injectVulnerable: target not found', target);
      el.innerHTML = html;
      return el;
    },

    /**
     * Inject as plain text (safe).
     * @param {string|Element} target
     * @param {string} text
     */
    injectSafeText(target, text) {
      const el = resolveTarget(target);
      if (!el) return console.warn('injectSafeText: target not found', target);
      // Display exactly what user typed, no HTML execution
      el.textContent = text;
      return el;
    },

    /**
     * Inject sanitized HTML using DOMPurify if available.
     * If DOMPurify is not present, attempts to load from CDN (requires network).
     * @param {string|Element} target
     * @param {string} html
     * @returns {Promise<Element>}
     */
    async injectSanitized(target, html) {
      const el = resolveTarget(target);
      if (!el) return console.warn('injectSanitized: target not found', target);
      if (typeof DOMPurify === 'undefined') {
        // try to load DOMPurify from jsdelivr
        await loadScriptOnce('https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js');
      }
      if (typeof DOMPurify === 'undefined') {
        console.warn('DOMPurify not available; falling back to textContent');
        el.textContent = html;
        return el;
      }
      const clean = DOMPurify.sanitize(html);
      el.innerHTML = clean;
      return el;
    },

    /**
     * Run a short set of harmless payloads to demonstrate XSS execution vs safe insertion.
     * Only uses alert(...) style payloads. Does NOT exfiltrate data.
     * @param {string|Element} target
     * @param {object} options - { pause: ms between steps, showSafe: bool }
     */
    async autoTest(target, options = {}) {
      const { pause = 600, showSafe = true } = options;
      const el = resolveTarget(target);
      if (!el) return console.warn('autoTest: target not found', target);

      const payloads = [
        '<img src=x onerror=alert("injected: img onerror")>',               // image onerror
        '<svg/onload=alert("injected: svg onload")>',                      // svg onload
        '<b>bold text</b> <i>and italic</i>',                             // harmless HTML
        '<script>console.log("script tag executed (if vulnerable)");alert("injected: script tag");</script>'
      ];

      // Create a visual runner box if target exists
      const runner = document.createElement('div');
      runner.style.marginTop = '8px';
      runner.style.padding = '8px';
      runner.style.border = '1px dashed #999';
      runner.style.fontFamily = 'monospace';
      runner.innerText = 'autoTest running — check alerts/console.';

      el.parentNode && el.parentNode.insertBefore(runner, el.nextSibling);

      for (const p of payloads) {
        runner.innerText = 'injecting (vulnerable): ' + p.slice(0, 60).replace(/\n/g,' ');
        this.injectVulnerable(el, p);
        await wait(pause);
        if (showSafe) {
          runner.innerText = 'injecting (safe text): ' + p.slice(0, 60).replace(/\n/g,' ');
          this.injectSafeText(el, p);
          await wait(pause);
          runner.innerText = 'injecting (sanitized): ' + p.slice(0, 60).replace(/\n/g,' ');
          await this.injectSanitized(el, p);
          await wait(pause);
        }
      }
      runner.innerText = 'autoTest finished.';
      return true;
    },

    /**
     * Quick helper: create a demo vulnerable div on the document body and return selector.
     * Use only on test pages.
     * @param {string} id
     * @returns {string} selector
     */
    createDemoDiv(id = 'xss-demo-vuln') {
      const existing = document.getElementById(id);
      if (existing) return '#' + id;
      const d = document.createElement('div');
      d.id = id;
      d.style.minHeight = '80px';
      d.style.border = '1px solid #f88';
      d.style.background = '#fff2f2';
      d.style.padding = '8px';
      d.style.margin = '8px 0';
      d.textContent = 'Demo vulnerable container: use XSSInjector.injectVulnerable("' + '#' + id + '", "<img ...>")';
      document.body.appendChild(d);
      return '#' + id;
    }
  };

  // --- utilities ---
  function resolveTarget(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    if (target instanceof Element) return target;
    return null;
  }

  function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // load script only once
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[data-src="' + src + '"]')) {
        // already added
        const existing = document.querySelector('script[data-src="' + src + '"]');
        existing.onload ? existing.onload(resolve) : resolve();
        return;
      }
      const s = document.createElement('script');
      s.async = true;
      s.src = src;
      s.setAttribute('data-src', src);
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  // expose to global
  global.XSSInjector = XSSInjector;
})(window);
/* ============================================================================
   Chekin · Guest App V3 — Flat depth restorer
   ----------------------------------------------------------------------------
   Removing every shadow left many cards/panels with no boundary (near-white
   surfaces on near-white backgrounds). This script restores definition WITHOUT
   shadows: it tags formerly-shadowed light surfaces with `data-flat-surface`,
   and flat-ui.css draws a crisp 1px `outline` (no layout shift, not a shadow).

   Heuristic for "a surface that needs a boundary":
     · sizeable block element (not a button/input/text node)
     · rounded (radius >= 10px)
     · solid, near-white background (dark/colored/gradient surfaces read fine)
     · no border of its own yet
   Floating layers (absolute/fixed, z-index >= 1) get a slightly stronger line
   so they read as elevated above the content beneath.

   Usage:  <script src="/styles/flat-ui.js" defer></script>   (after components)
   ============================================================================ */
(function () {
  'use strict';
  var SKIP = /^(BUTTON|INPUT|SELECT|TEXTAREA|A|IMG|SVG|PATH|CANVAS|LABEL|SPAN|P|H1|H2|H3|H4|H5|H6|BR|HR|I|B|STRONG|EM|SMALL|LI|UL|OL|DL|DT|DD|TD|TH)$/;

  function luminance(bg) {
    var m = bg && bg.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(parseFloat);
    var a = p.length > 3 ? p[3] : 1;
    if (a < 0.35) return null;                      // effectively see-through
    return (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255;
  }

  function consider(el) {
    if (el.hasAttribute('data-flat-surface') || el.hasAttribute('data-flat-skip')) return;
    if (SKIP.test(el.tagName)) return;

    var r = el.getBoundingClientRect();
    if (r.width < 140 || r.height < 44 || r.width > 2200) return;

    var cs = getComputedStyle(el);
    if ((parseFloat(cs.borderTopLeftRadius) || 0) < 10) return;
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return;   // gradients/photos read fine
    var L = luminance(cs.backgroundColor);
    if (L === null || L < 0.82) return;                                 // only near-white needs help
    // NOTE: we no longer skip elements that already have a (faint) border —
    // those are exactly the cards that lost their definition with the shadow.
    // The inset outline overlaps any 1px border to read as one crisp edge.
    var bw = parseFloat(cs.borderTopWidth) || 0;
    if (bw >= 2 && cs.borderTopStyle !== 'none') return;                // already strongly bounded

    var floating = (cs.position === 'absolute' || cs.position === 'fixed') &&
                   (parseInt(cs.zIndex, 10) || 0) >= 1;
    el.setAttribute('data-flat-surface', floating ? 'float' : '');
  }

  function scan() {
    try {
      var nodes = document.body.getElementsByTagName('*');
      for (var i = 0; i < nodes.length; i++) consider(nodes[i]);
    } catch (e) {}
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(scan, 120); }

  function boot() {
    scan();
    // Web components and the flow's screen swaps render late — keep up with them.
    try {
      new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    setTimeout(scan, 400);
    setTimeout(scan, 1200);
    window.addEventListener('load', scan);
    window.addEventListener('resize', schedule);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

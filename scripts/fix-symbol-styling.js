/**
 * fix-symbol-styling.js
 * Adjusts all 75 symbol detail pages:
 * 1. Replace <details>-based FAQ with proper .faq-item/.faq-question/.faq-answer accordion (matching landing page)
 * 2. Add proper padding/spacing to containers (community tags, variant related links, source boxes)
 * 3. Center all text content
 * 4. Include faq-accordion JS at bottom
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'symbols');
const LANGS = [
  { dir: '', prefix: '/symbols/' },
  { dir: 'en', prefix: '/symbols/en/' },
  { dir: 'fr', prefix: '/symbols/fr/' },
  { dir: 'es', prefix: '/symbols/es/' },
  { dir: 'ru', prefix: '/symbols/ru/' }
];

const SYMBOLS = [
  'auto-unfall','ex-partner','fallen','fliegen','haus-raeume',
  'hunde-katzen','nackt-sein','pruefung','schlangen','schwangerschaft',
  'spinnen','tod','verfolgt-werden','wasser','zaehne-verlieren'
];

let processed = 0, skipped = 0;

for (const lang of LANGS) {
  for (const sym of SYMBOLS) {
    const dir = lang.dir ? path.join(BASE, lang.dir) : BASE;
    const fp = path.join(dir, sym + '.html');
    if (!fs.existsSync(fp)) { console.log(`SKIP (not found): ${fp}`); skipped++; continue; }
    
    let html = fs.readFileSync(fp, 'utf8');
    
    // ===== 1. REPLACE FAQ SECTION =====
    // Current pattern: <section> with <!-- FAQ --> containing <details class="group">
    // Target: .faq-accordion with .faq-item / .faq-question / .faq-answer
    
    // Extract FAQ questions and answers from current <details> elements
    const faqSectionRe = /<!-- FAQ -->\s*<section[^>]*>\s*<h2[^>]*>.*?<\/h2>\s*([\s\S]*?)<\/section>/;
    const faqMatch = html.match(faqSectionRe);
    
    if (faqMatch) {
      const faqContent = faqMatch[1];
      // Extract each details Q&A
      const detailsRe = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/details>/g;
      const qaItems = [];
      let m;
      while ((m = detailsRe.exec(faqContent)) !== null) {
        // Clean the summary text (remove the ▾ span)
        let question = m[1].replace(/<span[^>]*>▾<\/span>/g, '').trim();
        // Remove any remaining HTML tags from question
        question = question.replace(/<[^>]+>/g, '').trim();
        let answer = m[2].trim();
        qaItems.push({ question, answer });
      }
      
      if (qaItems.length > 0) {
        // Build new FAQ accordion HTML
        let faqHtml = `<!-- FAQ -->
      <section class="mb-10 text-center">
        <h2 class="text-2xl font-bold mb-6" style="font-family:Poppins,Arial,sans-serif;color:#22d3ee;"><span>❓</span> ${getFaqTitle(lang.dir)}</h2>
        <div class="faq-accordion" id="faqAccordionSymbol">`;
        
        qaItems.forEach((qa, i) => {
          const id = `sfaq${i + 1}`;
          faqHtml += `
          <div class="faq-item">
            <button class="faq-question" aria-expanded="false" aria-controls="${id}" id="${id}-label">
              <span>${qa.question}</span>
              <svg class="faq-chevron" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><polyline points="6,9 11,14 16,9" stroke="#00CFFF" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </button>
            <div class="faq-answer" id="${id}" role="region" aria-labelledby="${id}-label">
              ${qa.answer}
            </div>
          </div>`;
        });
        
        faqHtml += `
        </div>
      </section>`;
        
        // Replace old FAQ section
        html = html.replace(faqSectionRe, faqHtml);
      }
    }
    
    // Add FAQ accordion JS before </body> if not already present
    if (!html.includes('faqAccordionSymbol') || !html.includes('initFaqAccordionSymbol')) {
      // Only add if we have the new accordion
      if (html.includes('faqAccordionSymbol')) {
        const faqJs = `
  <script>
    (function () {
      function initFaqAccordionSymbol() {
        var acc = document.getElementById('faqAccordionSymbol');
        if (!acc) return;
        var questions = acc.querySelectorAll('.faq-question');
        questions.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            questions.forEach(function (b) {
              b.setAttribute('aria-expanded', 'false');
            });
            if (!expanded) {
              this.setAttribute('aria-expanded', 'true');
            }
          });
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaqAccordionSymbol);
      } else {
        initFaqAccordionSymbol();
      }
    })();
  </script>`;
        html = html.replace('</body>', faqJs + '\n</body>');
      }
    }
    
    // ===== 2. ADD TEXT-CENTER TO ALL MAIN SECTIONS =====
    
    // Biosync section: add text-center
    html = html.replace(
      /(<section class="mb-10 p-6 rounded-2xl relative overflow-hidden")/g,
      '$1 style-marker-biosync'  // temporary marker — we'll use a different approach
    );
    // Remove temp marker
    html = html.replace(/style-marker-biosync/g, '');
    
    // Add text-center to all section containers that don't have it
    // Pattern 1: inline sections (single line class attribute)
    html = html.replace(
      /(<section class="mb-10)((?:\s+p-6 rounded-2xl)(?:\s+relative overflow-hidden)?")(\s)/g,
      (match, pre, mid, post) => {
        if (match.includes('text-center')) return match;
        return `${pre} text-center${mid}${post}`;
      }
    );
    
    // Pattern 2: multi-line sections (class on separate line from <section)
    html = html.replace(
      /(<section\s*\n\s*class="mb-10 p-6 rounded-2xl")/g,
      (match) => {
        if (match.includes('text-center')) return match;
        return match.replace('class="mb-10 p-6 rounded-2xl"', 'class="mb-10 text-center p-6 rounded-2xl"');
      }
    );
    
    // Deep Variants section: add text-center
    html = html.replace(
      /(<section class="mb-10">)\s*(<h2[^>]*>[\s\S]*?🔄)/,
      (match, sec, h2) => {
        return `<section class="mb-10 text-center">\n        ${h2}`;
      }
    );
    
    // Variant cards: center text
    html = html.replace(
      /(<div class="p-5 rounded-2xl")/g,
      '<div class="p-5 rounded-2xl text-center"'
    );
    
    // ===== 3. FIX SPACING IN CONTAINERS =====
    
    // Community companion symbols container: increase padding and gap
    // Current: <div class="flex flex-wrap gap-2"> for companion tags
    // Add: justify-center and more gap
    html = html.replace(
      /(<div class="flex flex-wrap gap-2">)\s*(<a href="[^"]*" class="text-xs px-3 py-1)/g,
      '<div class="flex flex-wrap gap-3 justify-center mt-3">\n            $2'
    );
    
    // Variant related links: increase gap, center, and add padding
    // Current: <div class="flex flex-wrap gap-2"><span class="text-[11px]
    html = html.replace(
      /<div class="flex flex-wrap gap-2"><span class="text-\[11px\] text-gray-500">/g,
      '<div class="flex flex-wrap gap-3 justify-center mt-3 pt-3" style="border-top:1px solid rgba(255,255,255,0.05);"><span class="text-[11px] text-gray-500">'
    );
    
    // Related links inside variant cards: add spacing between links  
    html = html.replace(
      /(<a href="[^"]*" class="text-\[11px\] text-cyan-500\/70[^"]*"[^>]*>[^<]*<\/a>)(<a href)/g,
      '$1 $2'
    );
    
    // Companion symbols label: more margin
    html = html.replace(
      /(<p class="text-xs text-gray-500 mb-2")/g,
      '<p class="text-xs text-gray-500 mb-3 mt-1"'
    );
    
    // Source details boxes: more top spacing
    html = html.replace(
      /(<details class="mt-4" style="border-top:)/g,
      '<details class="mt-6" style="border-top:'
    );
    
    // Emotion bars container: center labels
    html = html.replace(
      /(<div class="flex justify-between text-sm mb-1">)/g,
      '<div class="flex justify-between text-sm mb-1 px-1">'
    );
    
    // Section headers with h2: ensure text-center where needed
    // Community stats header, Biosync header, FAQ header - all centered via parent
    
    // CTA section: ensure centered
    html = html.replace(
      /<section class="text-center py-12">/,
      '<section class="text-center py-16">'
    );
    
    // ===== 4. ENSURE STYLE.CSS IS LINKED =====
    // style.css is already linked — the faq-accordion styles from landing page apply
    
    fs.writeFileSync(fp, html, 'utf8');
    console.log(`OK  ${lang.dir || 'de'}/${sym}`);
    processed++;
  }
}

console.log(`\nDone. Processed: ${processed}, Skipped: ${skipped}`);

function getFaqTitle(langDir) {
  switch (langDir) {
    case 'en': return 'Frequently Asked Questions';
    case 'fr': return 'Questions fréquentes';
    case 'es': return 'Preguntas frecuentes';
    case 'ru': return 'Часто задаваемые вопросы';
    default: return 'Häufige Fragen';
  }
}

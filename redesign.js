const fs = require('fs');
let css = fs.readFileSync('public/style.css', 'utf-8');

// Update Root Variables
css = css.replace(/:root\s*\{[\s\S]*?\}/, `:root {
  --bg-base: #F7F5F0;
  --bg-surface: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-card-hover: #FAF8F5;
  --bg-input: #F0EBE1;
  --bg-surface-soft: #EAE6D8;
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.15);
  --accent: #E63946;
  --accent-light: #F0717B;
  --accent-glow: rgba(230, 57, 70, 0.15);
  --text-primary: #111111;
  --text-secondary: #4A4A4A;
  --text-muted: #7A7A7A;
  --green: #2E7D32;
  --blue: #1976D2;
  --orange: #E65100;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-soft: 0 8px 30px rgba(0, 0, 0, 0.06);
}`);

// Update Body Background
css = css.replace(/background: radial-gradient[^;]+;/, 'background: var(--bg-base);');

// Fix Hardcoded White Texts where appropriate
css = css.replace(/\.category-header \{\s*[^}]*color:\s*#fff;/g, (match) => match.replace('#fff', 'var(--text-primary)'));
css = css.replace(/\.item-name \{\s*[^}]*color:\s*#fff;/g, (match) => match.replace('#fff', 'var(--text-primary)'));
css = css.replace(/\.qty-value \{[^\}]*color:\s*#fff;/g, (match) => match.replace('#fff', 'var(--text-primary)'));
css = css.replace(/\.qty-btn \{[^\}]*color:\s*#fff;/g, (match) => match.replace('#fff', 'var(--text-primary)'));

// Fix rgba(255,255,255, x) -> rgba(0,0,0, x) for borders, backgrounds
css = css.replace(/rgba\(255,255,255,0\.04\)/g, 'rgba(0,0,0,0.02)');
css = css.replace(/rgba\(255,255,255,0\.05\)/g, 'rgba(0,0,0,0.03)');
css = css.replace(/rgba\(255,255,255,0\.08\)/g, 'rgba(0,0,0,0.05)');
css = css.replace(/rgba\(255,255,255,0\.12\)/g, 'rgba(0,0,0,0.08)');
css = css.replace(/rgba\(255,255,255,0\.14\)/g, 'rgba(0,0,0,0.1)');
css = css.replace(/rgba\(255,255,255,0\.24\)/g, 'rgba(0,0,0,0.15)');
css = css.replace(/rgba\(255,255,255,0\.35\)/g, 'rgba(0,0,0,0.2)');

// specific fixes
css = css.replace(/color:\s*#fff;/g, function(match, offset) {
  const preceding = css.slice(Math.max(0, offset - 50), offset);
  if (preceding.includes('btn-primary') || preceding.includes('btn-success') || preceding.includes('.badge-primary') || preceding.includes('.badge-success') || preceding.includes('.qty-btn:hover')) {
    return 'color: #fff;';
  }
  return 'color: var(--text-primary);';
});
css = css.replace(/color:\s*#f3f5fb;/g, 'color: var(--text-primary);');

// Update specific elements that need dark borders instead of light
css = css.replace(/linear-gradient\(145deg, rgba\(20,22,35,0\.95\), rgba\(255,114,94,0\.12\)\)/g, 'linear-gradient(145deg, #FFFFFF, rgba(230, 57, 70, 0.08))');
css = css.replace(/rgba\(12,16,28,0\.97\)/g, 'rgba(255,255,255,0.95)');

// Sidebar specific
css = css.replace(/background: var\(--bg-surface\);/, 'background: var(--bg-surface); border-right: 1px solid var(--border);');
css = css.replace(/\.sidebar-link\.active \{\s*background: linear-gradient[^;]+;/, 'background: var(--accent-glow);');
css = css.replace(/\.sidebar-link\.active \{[^\}]*color:\s*#fff;/, '.sidebar-link.active { background: var(--accent-glow); color: var(--accent);');
css = css.replace(/\.admin-header \{\s*background: rgba\(255,255,255,0\.02\)/, '.admin-header { background: rgba(0,0,0,0.02)');
css = css.replace(/\.admin-table th \{\s*background: rgba\(255,255,255,0\.03\)/, '.admin-table th { background: rgba(0,0,0,0.03)');
css = css.replace(/box-shadow: 0 14px 28px rgba\(255,114,94,0\.22\);/, 'box-shadow: 0 14px 28px rgba(230, 57, 70, 0.25);');
css = css.replace(/box-shadow: 0 20px 50px rgba\(0,0,0,0\.18\);/, 'box-shadow: 0 10px 30px rgba(0,0,0,0.06);');

// Input backgrounds
css = css.replace(/background: var\(--bg-input\);/g, 'background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border);');

// Qty buttons and inputs
css = css.replace(/\.qty-btn \{\s*width: 38px;\s*height: 38px;\s*border-radius: var\(--radius-md\);\s*border: none;\s*background: rgba\(0,0,0,0\.05\);\s*color: var\(--text-primary\);/g, 
  '.qty-btn { width: 38px; height: 38px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-primary);');

// Item icon
css = css.replace(/\.item-icon \{\s*background: rgba\(0,0,0,0\.05\);\s*display: grid;\s*place-items: center;\s*font-size: 2\.2rem;\s*color: var\(--text-primary\);\s*\}/, 
  '.item-icon { background: var(--bg-surface-soft); display: grid; place-items: center; font-size: 2.2rem; color: var(--text-primary); border: 1px solid var(--border); }');

fs.writeFileSync('public/style.css', css, 'utf-8');
console.log('Redesign complete!');

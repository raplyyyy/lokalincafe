/**
 * migrate_categories.js
 * One-time script: normalize all menu item categories in Supabase
 * to canonical Title Case values matching admin.html.
 *
 * Run: node migrate_categories.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping from any old/legacy value → canonical value
const CATEGORY_MAP = {
  // Drinks (canonical: Title Case)
  'coffee':             'Coffee',
  'Coffee':             'Coffee',
  'Coffee Series':      'Coffee',      // ← found in Supabase
  'Coffee series':      'Coffee',
  'Signature Coffee':   'Coffee',      // ← found in Supabase
  'signature coffee':   'Coffee',
  'non-coffee':         'Non-Coffee',
  'Non-coffee':         'Non-Coffee',
  'Non-Coffee':         'Non-Coffee',
  'Non Coffee Series':  'Non-Coffee',  // ← found in Supabase
  'Non coffee series':  'Non-Coffee',
  'non coffee series':  'Non-Coffee',
  'kopi':               'Coffee',
  'tea':                'Tea',
  'Tea':                'Tea',
  'teh':                'Tea',
  'juice':              'Juice',
  'Juice':              'Juice',
  'jus':                'Juice',
  'squash':             'Squash',
  'Squash':             'Squash',
  'blend':              'Blend',
  'Blend':              'Blend',
  'water':              'Water',
  'Water':              'Water',
  'other drink':        'Other Drink',
  'Other drink':        'Other Drink',
  'Other Drink':        'Other Drink',
  'drink':              'Other Drink',
  'minuman':            'Other Drink',

  // Foods (canonical: Title Case)
  'main food':          'Main Food',
  'Main food':          'Main Food',
  'Main Food':          'Main Food',
  'snack':              'Snack',
  'Snack':              'Snack',
  'Snacks':             'Snack',
  'snacks':             'Snack',
  'pasta':              'Pasta',
  'Pasta':              'Pasta',
  'dessert':            'Dessert',
  'Dessert':            'Dessert',
  'paket':              'Paket',
  'Paket':              'Paket',
  'Rice Bowl':          'Main Food',   // ← found in Supabase → map to Main Food
  'rice bowl':          'Main Food',
};

async function migrate() {
  console.log('\n🔄 Fetching all menu items from Supabase...');
  const { data, error } = await supabase.from('menu').select('id, name, category');
  if (error) { console.error('❌ Failed to fetch:', error); process.exit(1); }

  console.log(`   Found ${data.length} items total.\n`);

  let updated = 0;
  let skipped = 0;

  for (const item of data) {
    if (item.id.startsWith('SYS_')) { skipped++; continue; }
    if (item.category === 'System') { skipped++; continue; }

    const canonical = CATEGORY_MAP[item.category?.trim()];
    if (!canonical) {
      console.log(`   ⚠️  UNKNOWN category "${item.category}" for "${item.name}" (${item.id}) — skipped`);
      skipped++;
      continue;
    }

    if (canonical === item.category) {
      skipped++;
      continue; // already correct
    }

    console.log(`   ✏️  "${item.name}" (${item.id}): "${item.category}" → "${canonical}"`);
    const { error: updateErr } = await supabase
      .from('menu')
      .update({ category: canonical })
      .eq('id', item.id);

    if (updateErr) {
      console.error(`   ❌ Failed to update ${item.id}:`, updateErr.message);
    } else {
      updated++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`   Updated : ${updated}`);
  console.log(`   Skipped : ${skipped}`);
}

migrate().catch(console.error);

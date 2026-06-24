/**
 * migrate_categories2.js
 * Restores detailed categories like "Coffee Series", "Signature Coffee",
 * "Non Coffee Series", and "Tea Series" in Supabase.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Map specific item IDs to their correct detailed category
const ITEM_CATEGORY_MAP = {
  // Coffee Series
  'd1': 'Coffee Series', // Americano
  'd2': 'Coffee Series', // Coffee Latte
  'd3': 'Coffee Series', // Capuccino
  'd4': 'Coffee Series', // Kopi Susu
  'd5': 'Coffee Series', // Cold Sweet Coffee
  'd6': 'Coffee Series', // Vanilla Coffee
  'd22': 'Coffee Series', // Caramel Coffee
  'd23': 'Coffee Series', // Hazelnut Coffee
  
  // Signature Coffee
  'd7': 'Signature Coffee', // Lokalin Signature
  'd8': 'Signature Coffee', // Butterscotch Coffee
  'd9': 'Signature Coffee', // Salted Caramel Coffee
  'd10': 'Signature Coffee', // Pandan Coffee
  'd11': 'Signature Coffee', // Banana Coffee
  'd27': 'Signature Coffee', // Summer Paradise
  'd28': 'Signature Coffee', // Peach Bloom Americano
  
  // Tea Series
  'd12': 'Tea Series', // Tea (Hot/Ice)
  'd13': 'Tea Series', // Lychee Tea
  'd14': 'Tea Series', // Lemon Tea
  'd15': 'Tea Series', // Peach Tea
  'd19': 'Tea Series', // Thai Tea
  
  // Non Coffee Series
  'd16': 'Non Coffee Series', // Matcha
  'd17': 'Non Coffee Series', // Chocolate
  'd18': 'Non Coffee Series', // Redvelvet
  'd20': 'Non Coffee Series', // Markisa
  
  // Squash
  'd24': 'Squash', // Lychee Squash
  'd25': 'Squash', // Peach Squash
  'd26': 'Squash', // Lemon Squash
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

    const targetCategory = ITEM_CATEGORY_MAP[item.id];
    
    if (!targetCategory) {
      skipped++;
      continue;
    }

    if (targetCategory === item.category) {
      skipped++;
      continue; // already correct
    }

    console.log(`   ✏️  "${item.name}" (${item.id}): "${item.category}" → "${targetCategory}"`);
    const { error: updateErr } = await supabase
      .from('menu')
      .update({ category: targetCategory })
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

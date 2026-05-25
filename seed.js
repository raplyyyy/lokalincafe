const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  try {
    console.log('Reading menu.json...');
    const menuRaw = fs.readFileSync('menu.json', 'utf-8');
    const menuData = JSON.parse(menuRaw);
    
    // Clear existing menu via JS API
    // Actually, deleting all without filtering requires a filter in Supabase JS: .neq('id', 'dummy')
    console.log('Clearing existing menu data...');
    const { error: delError } = await supabase.from('menu').delete().neq('id', 'dummy_value_that_doesnt_exist');
    if (delError) {
      console.warn('Could not clear data (might be empty already or permission error):', delError.message);
    }

    const rowsToInsert = [];
    
    for (const category of ['food', 'drinks']) {
      for (const item of menuData[category]) {
        rowsToInsert.push({
          id: item.id,
          name: item.name,
          description: item.description || null,
          price: item.price,
          category: item.category || (category === 'food' ? 'Main Food' : 'Coffee'),
          image: item.image || null,
          inStock: item.inStock !== false, // defaults to true
          stock: item.stock !== undefined ? item.stock : 100,
          hotCold: item.hotCold || false
        });
      }
    }

    console.log(`Inserting ${rowsToInsert.length} items to Supabase...`);
    const { error: insError } = await supabase.from('menu').insert(rowsToInsert);
    
    if (insError) {
      console.error('Error inserting data:', insError);
    } else {
      console.log(`Successfully imported ${rowsToInsert.length} menu items!`);
    }
    
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

seed();

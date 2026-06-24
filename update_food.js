const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFood() {
  console.log('Updating Rice Bowl categories...');
  const riceBowlIds = ['f5', 'f6', 'f7', 'f8']; // Ayam Pallekko, Paru Rica, Beef Blackpepper, Salted Egg
  
  for (const id of riceBowlIds) {
    await supabase.from('menu').update({ category: 'Rice Bowl' }).eq('id', id);
    console.log(`Updated ${id} to Rice Bowl`);
  }

  console.log('Updating descriptions for Bakara and Ubi Goreng...');
  await supabase.from('menu').update({ 
    description: 'Crispy fried bakara fish, savory and perfectly seasoned.' 
  }).eq('id', 'f18');
  console.log('Updated Bakara Goreng description');

  await supabase.from('menu').update({ 
    description: 'Crispy fried sweet potato snack, naturally sweet and crunchy.' 
  }).eq('id', 'f19');
  console.log('Updated Ubi Goreng description');
}

updateFood().catch(console.error);

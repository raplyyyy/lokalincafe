const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzawrtsjxeeznskspapw.supabase.co';
const supabaseKey = 'sb_publishable_infzH1M3iygZqnBDYVdVyQ_IYcxLPGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function initDB() {
  console.log("[DB] Supabase database ready.");
}

async function createOrder({ tableNumber, foodItems, drinkItems, totalPrice, note }) {
  const { data: order, error } = await supabase.from('orders').insert({
    tableNumber,
    foodItems: foodItems || [],
    drinkItems: drinkItems || [],
    totalPrice,
    isPaid: false,
    drinkStatus: 'pending',
    note: note || ""
  }).select().single();

  if (error) {
    console.error('Create order error:', error);
    throw error;
  }
  
  return mapOrder(order);
}

async function getAllActiveOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('isPaid', false)
    .order('tableNumber', { ascending: true });

  if (error) {
    console.error('Get active orders error:', error);
    throw error;
  }
  
  return data.map(mapOrder);
}

async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Get order by id error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

async function markAsPaid(id) {
  const { data, error } = await supabase
    .from('orders')
    .update({ isPaid: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Mark as paid error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

async function updateDrinkStatus(id, drinkStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ drinkStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update drink status error:', error);
    throw error;
  }
  
  return mapOrder(data);
}

// Helper to map Supabase naming to expected frontend naming
function mapOrder(order) {
  return {
    id: order.id,
    tableNumber: order.tableNumber,
    foodItems: order.foodItems || [],
    drinkItems: order.drinkItems || [],
    totalPrice: order.totalPrice,
    status: order.isPaid ? 'paid' : 'unpaid',
    drinkStatus: order.drinkStatus,
    timestamp: order.createdAt,
    note: order.note || ""
  };
}

module.exports = { initDB, createOrder, getAllActiveOrders, getOrderById, markAsPaid, updateDrinkStatus, supabase };

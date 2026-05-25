const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:raflianugrah12@db.lzawrtsjxeeznskspapw.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected!');

    // 1. Create Tables
    console.log('Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          category TEXT NOT NULL,
          image TEXT,
          "inStock" BOOLEAN DEFAULT true,
          stock INTEGER DEFAULT 100,
          "hotCold" BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          "tableNumber" INTEGER NOT NULL,
          "totalPrice" INTEGER NOT NULL,
          note TEXT,
          "isPaid" BOOLEAN DEFAULT false,
          "drinkStatus" TEXT DEFAULT 'pending',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          qty INTEGER NOT NULL,
          price INTEGER NOT NULL,
          category TEXT
      );

      CREATE TABLE IF NOT EXISTS stock_history (
          id SERIAL PRIMARY KEY,
          date DATE NOT NULL,
          department TEXT NOT NULL,
          data JSONB NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Tables created successfully.');

    // 2. Clear existing menu just in case of re-run
    console.log('Clearing old menu data (if any)...');
    await client.query('DELETE FROM menu;');

    // 3. Seed Menu Data
    console.log('Seeding menu data from menu.json...');
    const menuRaw = fs.readFileSync('menu.json', 'utf-8');
    const menuData = JSON.parse(menuRaw);
    
    let itemsCount = 0;
    
    for (const category of ['food', 'drinks']) {
      for (const item of menuData[category]) {
        await client.query(`
          INSERT INTO menu (id, name, description, price, category, image, "inStock", stock, "hotCold")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          item.id,
          item.name,
          item.description || null,
          item.price,
          item.category,
          item.image || null,
          item.inStock !== false, // defaults to true
          item.stock !== undefined ? item.stock : 100,
          item.hotCold || false
        ]);
        itemsCount++;
      }
    }
    console.log(`Successfully imported ${itemsCount} menu items!`);
    
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();

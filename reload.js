const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:raflianugrah12@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => client.query("NOTIFY pgrst, 'reload schema'")).then(() => {
  console.log('Schema reloaded!');
  process.exit(0);
}).catch(e => {
  console.error('Error:', e);
  process.exit(1);
});

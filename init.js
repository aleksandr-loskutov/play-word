const fs = require('fs');

if (!fs.existsSync('.env')) {
  console.log('No .env file found. Copying .env.example to .env');
  fs.copyFileSync('.env.sample', '.env');
}
if (!fs.existsSync('database')) {
  console.log('No database folder found. Creating database folder');
  fs.mkdirSync('database/pgdata', { recursive: true });
}

const path = require('path');
const fs = require('fs');

console.log('=== Deployment Health Check ===');
console.log('Current directory:', __dirname);
console.log('Backend directory:', path.join(__dirname, '..'));
console.log('Frontend directory:', path.join(__dirname, '..', '..', 'frontend'));
console.log('Frontend dist directory:', path.join(__dirname, '..', '..', 'frontend', 'dist'));

const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
const indexPath = path.join(frontendDistPath, 'index.html');

console.log('\n=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('RENDER:', process.env.RENDER);
console.log('RENDER_SERVICE_NAME:', process.env.RENDER_SERVICE_NAME);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

console.log('\n=== File System Check ===');
console.log('Frontend dist exists:', fs.existsSync(frontendDistPath));
console.log('Index.html exists:', fs.existsSync(indexPath));

if (fs.existsSync(frontendDistPath)) {
  console.log('Frontend dist contents:', fs.readdirSync(frontendDistPath));
}

console.log('\n=== Production Check ===');
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true' || process.env.RENDER_SERVICE_NAME;
console.log('isProduction:', isProduction);

if (!isProduction) {
  console.log('\n⚠️  WARNING: App is not in production mode!');
  console.log('This means the frontend will not be served.');
  console.log('Make sure NODE_ENV=production is set in your Render environment variables.');
}

if (isProduction && !fs.existsSync(indexPath)) {
  console.log('\n❌ ERROR: Frontend build not found!');
  console.log('The build process may have failed.');
  console.log('Check your Render build logs for errors.');
}

if (isProduction && fs.existsSync(indexPath)) {
  console.log('\n✅ SUCCESS: App should serve frontend correctly!');
}

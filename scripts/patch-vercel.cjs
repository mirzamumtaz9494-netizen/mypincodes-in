const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '../node_modules/@astrojs/vercel/dist/serverless/adapter.js');
if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, 'utf8');
  content = content.replace(/nodejs18\.x/g, 'nodejs20.x');
  if (!content.includes('22: { status')) {
    content = content.replace(
      /20: \{ status: 'default' \},/g,
      "20: { status: 'default' },\n    22: { status: 'default' },"
    );
  }
  fs.writeFileSync(target, content, 'utf8');
  console.log('[Patch] Successfully set Vercel serverless runtime to nodejs20.x / nodejs22.x');
}

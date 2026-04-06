const fs = require('fs');
const https = require('https');

const envFile = fs.readFileSync('.env.local', 'utf8');
const keyMatch = envFile.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);

if (!keyMatch) {
  console.log('No API key found');
  process.exit(1);
}
const key = keyMatch[1].trim();

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if(json.models) {
      console.log("AVAILABLE MODELS:");
      json.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).forEach(m => console.log(m.name));
    } else {
      console.log(json);
    }
  });
});

const https = require('https');

const API_KEY = process.env.BREVO_API_KEY; // Use environment variable instead of hardcoded key

const data = JSON.stringify({
    type: 'transactional',
    unicodeEnabled: true,
    sender: 'MuskyPaws',
    recipient: '+306948965371', // User's phone
    content: 'MuskyPaws Test: Το σύστημα SMS λειτουργεί κανονικά! 🐾'
});

const options = {
    hostname: 'api.brevo.com',
    path: '/v3/transactionalSMS/sms',
    method: 'POST',
    headers: {
        'accept': 'application/json',
        'api-key': API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response: ${responseData}`);
    });
});

req.on('error', (error) => {
    console.error('Request Error:', error);
});

req.write(data);
req.end();

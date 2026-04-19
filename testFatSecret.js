const clientId = '2318143d1883431b896616987995a920';
const clientSecret = 'e9803ec89cd74628993ec115d49e6f72';
const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

async function test() {
  console.log('Fetching token...');
  const res = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=basic'
  });
  const data = await res.json();
  console.log('Token:', data);

  if (data.access_token) {
     const searchRes = await fetch(`https://platform.fatsecret.com/rest/server.api?method=foods.search.v2&search_expression=chicken&format=json`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
     });
     const searchData = await searchRes.json();
     console.log('Search Results:', JSON.stringify(searchData, null, 2).substring(0, 800));
  }
}

test();

const http = require('http');

http.get('http://localhost:5050/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/backlog', (res) => {
  res.setEncoding('utf8');
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('--- RESPONSE ---');
      if (data.data && data.data.sprints) {
         data.data.sprints.forEach(s => {
           console.log(`SprintId: ${s.sprintId}, Name: ${s.name}, Status: ${s.status}, Items: ${s.items ? s.items.length : 'NO ITEMS'}`);
         });
      } else {
         console.log('No sprints in backlog response');
      }
    } catch(e) {
      console.error('Parse Error:', e.message);
      console.log('Last 100 chars of body:', body.slice(-100));
    }
  });
}).on('error', e => console.error('Request error:', e));

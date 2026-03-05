const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/backlog',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => (body += d));
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      let sampleTask = null;
      if (data.data && data.data.sprints && data.data.sprints.length > 0) {
        const sprint = data.data.sprints[0];
        if (sprint.items && sprint.items.length > 0) {
          sampleTask = sprint.items[0];
        }
      }

      if (sampleTask) {
        const taskId = sampleTask.workItemId || sampleTask.id;
        console.log('Doing PUT for taskId:', taskId);

        const putPayload = JSON.stringify({
          title: sampleTask.title || sampleTask.name,
          description: sampleTask.description || '',
          type: sampleTask.type || 'UserStory',
          status: 'IN_PROGRESS',
          priority: sampleTask.priority || 'MEDIUM',
          parentId: sampleTask.parentId || null,
          assigneeId: sampleTask.assigneeId || null,
          dueDate: sampleTask.dueDate || null,
          storyPoint: sampleTask.storyPoint || 0,
        });

        const putOptions = {
          hostname: 'localhost',
          port: 5050,
          path: `/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/${taskId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(putPayload),
          },
        };

        const putReq = http.request(putOptions, (putRes) => {
          let putBody = '';
          putRes.on('data', (d) => (putBody += d));
          putRes.on('end', () => {
            console.log('PUT Response Status:', putRes.statusCode);
            console.log('PUT Response Body:', putBody);
          });
        });
        putReq.on('error', (e) => console.error(e));
        putReq.write(putPayload);
        putReq.end();
      } else {
        console.log('No task found to test');
      }
    } catch (e) {
      console.error(e);
    }
  });
});
req.on('error', (e) => console.error(e));
req.end();

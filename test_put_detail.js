const http = require('http');

console.log("Fetching backlog items...");
const options = {
  hostname: 'localhost',
  port: 5050,
  path: '/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/backlog',
  method: 'GET'
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
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
           console.log("Found taskId:", taskId);
           
           // FETCH FULL DETAILS
           http.get(`http://localhost:5050/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/${taskId}`, (detailRes) => {
             let dBody = '';
             detailRes.on('data', c => dBody += c);
             detailRes.on('end', () => {
               try {
                  const dData = JSON.parse(dBody);
                  const td = dData.data;
                  console.log("Detail task info:", td);

                  const putPayload = JSON.stringify({
                    title: td.title || td.name,
                    description: td.description || "",
                    type: td.type || "UserStory",
                    status: "IN_PROGRESS",
                    priority: td.priority || "MEDIUM",
                    parentId: td.parentId || null,
                    assigneeId: td.assigneeId || null,
                    dueDate: td.dueDate || null,
                    storyPoint: td.storyPoint || 0,
                    sprintId: td.sprintId || null
                 });
                 console.log("Payload:", putPayload);

                 const putOptions = {
                   hostname: 'localhost',
                   port: 5050,
                   path: `/api/projects/eae678e5-57bc-43b7-9d6a-dbf212cf4802/work-items/${taskId}`,
                   method: 'PUT',
                   headers: {
                     'Content-Type': 'application/json-patch+json',
                     'Content-Length': Buffer.byteLength(putPayload)
                   }
                 };
      
                 const putReq = http.request(putOptions, putRes => {
                    let putBody = '';
                    putRes.on('data', d => putBody += d);
                    putRes.on('end', () => {
                       console.log("PUT Response Status:", putRes.statusCode);
                       console.log("PUT Response Body:", putBody);
                    });
                 });
                 putReq.on('error', e => console.error(e));
                 putReq.write(putPayload);
                 putReq.end();
                 
               } catch(ex){ console.log(ex) }
             });
           });

        } else {
           console.log("No task found to test");
        }
     } catch (e) {
        console.error(e);
     }
  });
});
req.on('error', e => console.error(e));
req.end();

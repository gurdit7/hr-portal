const cron = require('node-cron');
// 0 0 1 Jan *
const setupCronJobs = () => {

  cron.schedule('0 0 1 1,4,7,10 *', () => {
    fetch('http://localhost:3000/api/dashboard/leaves/sandwich-leaves-cron',{
        method:"PUT"
    })
  },
  {
    scheduled: true
  });
  cron.schedule('0 0 1 Jan *', () => {
    fetch('http://localhost:3000/api/dashboard/leaves/leaves-cron',{
        method:"PUT"
    })
  },
  {
    scheduled: true
  });

};

module.exports = setupCronJobs;

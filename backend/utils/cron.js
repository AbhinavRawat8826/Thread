import cron from 'cron'
import https from 'https';


const job = new cron.CronJob('*/14 * * * *', function () {
  https.get(`${process.env.API_URL}/ping`, (res) => {
    if (res.statusCode === 200) {
      console.log('GET request sent successfully');
    } else {
      console.log('GET request failed', res.statusCode);
    }
  })
  .on('error', (e) => console.error('Error while sending request', e));
});


job.start();

export default job;

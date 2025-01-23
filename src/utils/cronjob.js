var cron = require('node-cron');
const connectionRequest = require('../models/connectionRequest');
const { run } = require('./sendEmail');

cron.schedule('54 10 * * *', async () => {
  try{  
    //Todo 
    const res = await run("This is the test email", "I am sending this email from AWS SES!!");
    console.log(res);
  }catch(error){
    console.log(error);
  }
});

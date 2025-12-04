addEventListener('pointingTask', (resolve, reject, args) => {
  try {
    setInterval(() => {
      
      console.log('accepted this data: ' + JSON.stringify(args));
      resolve(" Pointage task executed successfully");
    }, 30000);


  } catch (err) {
    reject(err);
  }
});

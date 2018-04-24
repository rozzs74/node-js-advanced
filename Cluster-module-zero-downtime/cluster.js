const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;
  for (let i = 0; i<cpus; i++) {
    cluster.fork();
  }
  console.log(`Master PID: ${process.pid}`);

  // Function for listening event when node process is exit the master is notified
  cluster.on('exit', (worker, code, signal) => {
    
    // Once the master notified create new workers by having these conditions we can say that 
    // the worker actually crashed and was not manually disconnected or killed by the master process
    // For example the master process might decide to kill a process as we are using too much 
    // resources based on the load patterns and it sees that we need kill workers in that case 
    // exited after disconnect will be true if the master kill the worker due to too much resources
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` +
                  'Starting a new worker...');
      cluster.fork();
    }
  });
  // Process on restarting a workers the one that is crashed, SIGUSR2 is proper signal to use due to user command
  // So when the master process receive the signal its time to restart the workers. We will do it one at a time.
  process.on('SIGUSR2', () => {
    // Current workers
    const workers = Object.values(cluster.workers);

    const restartWorker = (workerIndex) => {
      const worker = workers[workerIndex];
      if (!worker) return;

      // listen when a worker exit
      worker.on('exit', () => {
        if (!worker.exitedAfterDisconnect) return;
        console.log(`Exited process ${worker.process.pid}`);
        cluster.fork().on('listening', () => {
          restartWorker(workerIndex + 1);
        });
      });
      // disconnect the worker
      worker.disconnect();
    };

    restartWorker(0);
  });

} else {
  require('./server');
}

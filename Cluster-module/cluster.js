const cluster = require('cluster');
const os = require('os');

// Check if cluster is master basically this script is to check if this file  is being load as cluster master process
if (cluster.isMaster) {
  const cpus = os.cpus().length; // get CPU cores
  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i<cpus; i++) {
    cluster.fork(); // create a workers in the system
  } 
} else {

  // work mode!!!!!
  require('./server');
}

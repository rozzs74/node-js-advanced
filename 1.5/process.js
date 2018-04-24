// process is an event emitter

process.on('exit', (code) => {
  // do one final synchronous operation
  // before the node process terminates

  console.log(`About to exit with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  // something went unhandled.
  // Do any cleanup and exit anyway!

  console.error(err); // don't do just that.

  // FORCE exit the process too. because the node is strill running
  process.exit(1); // Close the process 
});

// keep the event loop busy
process.stdin.resume();

// trigger a TypeError exception
console.dog();

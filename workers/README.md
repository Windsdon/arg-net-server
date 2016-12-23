# Workers
Worker are functions that run on each client, processing a given task.

The `worker.js` file should export a function with this signature:
```javascript
function worker(task, callback)
```
or a `Promise` that resolves to one.


The `task` parameter is an object that contains:
```javascript
{
	"worker": {
		"id": "md5-threshold"
	},
	"id": "8d2b0705-9cf2-4b15-92f3-a1d869f61f61",
	"tracker": new ProgressTracker(...),
	"range": ...,  // only for rangeSearch tasks, varies depending on implementation
	"params": {
		"paramName": "paramValue",
		...
	},
	"$async": (() => true|false) => {} // makes sync code run asynchronously
}
```
The `ProgressTracker` interface is:
```javascript
// The range length is given by the LoadDistributer on the server
tracker.length

// Increments the total solved counter by one
tracker.solveOne()

// Solve the entire range
tracker.solveAll()

// Automatically calls the callback once everything is processed
tracker.then(callback)
```

## Working with Ranges
When you are dealing with a range search, the `task.range` property will have the
range value. Iterating through the range is done automatically by the client.
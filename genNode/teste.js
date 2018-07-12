const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

var a = new Date();
var b = [1,2,3,4,5,6];
var c = {};
c[1] =1;
c[2] =1;
c[3] =1;
c[4] =1;
c[5] =1;
c[6] =1;

performance.mark('A');

for (var i = 0; i < 100000; i++){
  // new Date(a.getFullYear(), a.getMonth(), a.getDate());
   //(new Date()).toJSON()
   //(new Date()).toLocaleDateString()
  //  `${a.getFullYear()}${a.getMonth()}${a.getDate()}`
  //b.indexOf(6);
  // c[6];
  var d = {...c};
}

performance.mark('B');
performance.measure('A to B', 'A', 'B');
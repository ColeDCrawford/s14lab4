const people = [
   { name: 'Lee', hrs: 3, exp: 4 },
   { name: 'Ajay', hrs:2, exp: 6 },
   { name: 'Jane', hrs:2, exp: 4 },
   { name: 'Cole', hrs:5, exp:3 },
   { name: 'Dan', hrs: 5, exp: 3}
];
function groupBy(objectArray, property) {
   return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
         acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
   }, {});
}
const groupedPeople = groupBy(people, 'hrs', 'exp');
console.log(groupedPeople);

function groupBy(objArr, prop1, prop2){
  var helper = {};
  var result = objArr.reduce(function(r, o) {
    var key = o[prop1] + '-' + o[prop2];
    console.log(key);
    if(!helper[key]) {
      helper[key] = [Object.assign({}, o)]; // create a copy of o
      console.log(helper);
      r.push(helper[key]);
      console.log(r);
    } else {
      helper[key].push(Object.assign({}, o))
    }

    return r;
  }, []);
  return result;
}

let arr = []
for (var i = 0; i < 26; i++) {
    let c = String.fromCharCode(65 + i);
    for(var j = 0; j < 10; j++){
        arr.push(c + j);
    }
}
console.log(arr.join(','))
throw new Error('')
function promiseFactory(index) {
    return new Promise((resolve, reject) => {
        console.log(index);
        setTimeout(() => {
            resolve();
        }, 2000);
    });
}
// promiseFactory(0).then(()=>{
//     return promiseFactory(1)
// }).then(()=>{
//     return promiseFactory(2)
// })
function executePromises(promisesIndex) {
    var result = Promise.resolve();
    promisesIndex.forEach((index) => {
        result = result.then(()=>{
            return promiseFactory(index)
        });
    });
    return result;
}
console.log(executePromises([1, 2])); //1,2,3,4

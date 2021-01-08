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

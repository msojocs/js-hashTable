// https://www.topshelfcomix.com/catalog/isbn-list
let item = document.getElementsByClassName('isbn-item')
let ret = ""
for(var i = 0; i < item.length; i++){
    let isbn = item[i].getElementsByClassName("isbn-number")[0].textContent.replace(' ', '')
    if(-1 === isbn.indexOf('-'))continue;
    let name = item[i].getElementsByClassName("isbn-info")[0].textContent.split(',')[0]
    // console.log(isbn + ", " + name)
    ret += isbn + "\r\n"
}
console.log(ret)

// http://www.baishicha.com/chengdu-yidong/
let numList = $('li a')
let ret = ""
for(var i=0; i < numList.length; i++){
    if(/\d{11}/.test(numList[i].text)){
        ret += numList[i].text + "\n"
    }
}
console.log(ret)
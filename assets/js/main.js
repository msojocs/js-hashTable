// 改变例子
function exampleChange(e) {
    console.log(e);
    let data = "";
    switch (e) {
        case "directAddr_example1":
            for (var i = 1; i <= 100; i++) {
                data += i + "," + i * 100 + "\n";
            }
            document.getElementById("b").value = 0;
            break;
        case "directAddr_example2":
            for (var i = 1949; i < new Date().getFullYear(); i++) {
                data += i + "," + i * 100 + "\n";
            }
            document.getElementById("b").value = -1948;
            break;
        default:
            break;
    }
    document.getElementById("data").value = data;
}

// 修改数据
function dataChange() {
    let constructor = getConstructor();
    console.log(constructor);
    if (
        "directAddr" === constructor ||
        $("#length")[0].value <
            document.getElementById("data").value.split("\n").length
    ) {
        $("#length")[0].value = document
            .getElementById("data")
            .value.split("\n").length;
    }
}

// 改变构造方法
function constructorChange() {
    let constructor = getConstructor();
    console.log(constructor);
    if ("mod" === constructor) {
        $("#mod-area").css("display", "block");
    } else {
        $("#mod-area").css("display", "none");
    }
    // 初始化数据：
    switch (constructor) {
        case "directAddr":
            let data = "";
            for (var i = 1; i <= 100; i++) {
                data += i + "," + i * 100 + "\n";
            }
            document.getElementById("data").value = data;
            break;
        case "square":
            document.getElementById("data").value = square;
            break;
        case "fold":
            $("#data")[0].value = isbn;
            break;
        case "digitAnalyze":
            $("#data")[0].value = student;
            break;
        default:
            document.getElementById("data").value =
                "19, 14, 23, 01, 68, 20, 84, 27, 55, 11, 10, 79";
            break;
    }
    if ("directAddr" === constructor) {
        document.getElementById("collision-area").style["display"] = "none";
        document.getElementById("directAddr-value").style["display"] =
            "inline-grid";
        $("#reHash-area").css("display", "none");
    } else {
        document.getElementById("collision-area").style["display"] = "flex";
        document.getElementById("directAddr-value").style["display"] = "none";
        collisionChange();
    }
    dataChange();
}

// 改变冲突处理方法
function collisionChange() {
    let collision = getCollision();
    if ("reHash" === collision) {
        $("#reHash-area").css("display", "block");
    } else {
        $("#reHash-area").css("display", "none");
    }
}

// 哈希搜索
function hashSearch(value) {
    console.log(value);
}

// 生成哈希表
function genHashTable() {
    let constructor = getConstructor();
    let collision = getCollision();
    let data = document.getElementById("data").value;
    let length = parseInt($("#length")[0].value);

    // console.log(data);
    console.log("constructor->", constructor, "|", "collision->", collision);

    let ht = new HashTable(length, constructor, collision);

    let exps = [];
    if ("reHash" === collision) {
        exps = getReHashExp();
        ht.setReHashExp(exps);
    }
    if ("mod" === constructor) {
        ht.setP($("#p")[0].value);
    }
    if ("directAddr" === constructor) {
        let a = parseInt(document.getElementById("a").value);
        let b = parseInt(document.getElementById("b").value);
        ht.setAB(a, b);
        data = data.split(/\n/);
        console.log(data);
        data.forEach((ele) => {
            if (-1 === ele.indexOf(",")) {
                // 无 ','
                if (ele.length > 0) {
                    ht.push(ele);
                }
            } else {
                if (ele.split(",").length < 2) return;
                ht.push(ele.split(",")[0], ele.split(",")[1]);
            }
        });
    } else if ("fold" === constructor) {
        data = data.split(/\n/);
        console.log(data);
        data.forEach((ele) => {
            ht.push(ele);
        });
    } else if ("digitAnalyze" === constructor) {
        data = data.split(/\n/);
        data.forEach((ele) => {
            ht.push(ele);
        });
    } else {
        data = data.split(",");

        data.forEach((element) => {
            ht.push(element);
        });
    }
    console.log(ht.storage);

    document.getElementById("result").innerHTML = ht.toString();
}

function getReHashExp() {
    let exp = $("#reHashExp")[0].value;
    return exp.split(",");
}
function getConstructor() {
    let c = document.getElementsByName("constructor");
    for (var i = 0; i < c.length; i++) {
        if (c[i].checked) {
            return c[i].value;
            break;
        }
    }
}

function getCollision() {
    let c = document.getElementsByName("collision");
    for (var i = 0; i < c.length; i++) {
        if (c[i].checked) {
            return c[i].value;
            break;
        }
    }
}

function getData() {
    $.ajax({
        url: "data/isbn.txt",
        async: true,
        success: function (result) {
            // console.log(result)
            isbn = result;
        },
    });
    $.ajax({
        url: "data/square.txt",
        async: true,
        success: function (result) {
            // console.log(result)
            square = result;
        },
    });
    $.ajax({
        url: "data/student.txt",
        async: true,
        success: function (result) {
            // console.log(result)
            student = result;
        },
    });
}

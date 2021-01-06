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
    updateLength();
}

// 修改数据
function dataChange() {
    updateLength();
}

// 改变构造方法
function constructorChange() {
    let constructor = getConstructor();
    console.log(constructor);
    if ("mod" === constructor) {
        // 显示p输入框
        $("#mod-area").css("display", "block");
    } else {
        // 隐藏p输入框
        $("#mod-area").css("display", "none");
    }
    // 初始化数据
    initData();
    if ("directAddr" === constructor) {
        // =========直接定址法==========
        // 隐藏冲突处理方法
        document.getElementById("collision-area").style["display"] = "none";
        // 显示直接定址法的 参数输入框
        document.getElementById("directAddr-value").style["display"] =
            "inline-grid";
        $("#reHash-area").css("display", "none");
    } else {
        // 显示冲突处理方法
        document.getElementById("collision-area").style["display"] = "flex";
        // 隐藏直接定址法的 参数输入框
        document.getElementById("directAddr-value").style["display"] = "none";
        collisionChange();
    }
    dataChange();
}

// 更新表长
function updateLength() {
    let data = document.getElementById("data").value;
    let constructor = getConstructor();
    if (
        "directAddr" === constructor ||
        "digitAnalyze" === constructor ||
        "fold" === constructor
    ) {
        // 更新表长
        $("#length")[0].value = data.split("\n").length + 1;
    } else {
        $("#length")[0].value = data.split(",").length + 1;
    }
    // 清空表格
    $("#result-table").html("");
    // 添加元素
    for (var i = 0; i < $("#length")[0].value; i++) {
        appendTableCell(i, "null");
    }
}

// 初始化数据
function initData() {
    let constructor = getConstructor();
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
            $("#length")[0].value = square.split(",").length + 4;
            break;
        case "fold":
            $("#data")[0].value = isbn;
            break;
        case "digitAnalyze":
            $("#data")[0].value = student;
            break;
        default:
            document.getElementById("data").value =
                "19,14,23,01,68,20,84,27,55,11,10,79";
            $("#length")[0].value =
                document.getElementById("data").value.split(",").length + 4;
            break;
    }
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
    if (!ht) return;
    console.log(ht.search(value));
}

// 生成哈希表
function genHashTable() {
    let constructor = getConstructor();
    let collision = getCollision();
    let data = document.getElementById("data").value;
    let length = parseInt($("#length")[0].value);

    // console.log(data);
    console.log("constructor->", constructor, "|", "collision->", collision);

    ht = new HashTable(length, constructor, collision);

    let exps = [];
    if ("reHash" === collision) {
        exps = getReHashExp();
        ht.setReHashExp(exps);
    }
    if ("mod" === constructor) {
        ht.setP($("#p")[0].value);
    }
    if ("directAddr" === constructor) {
        // 直接定址法
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
        // 折叠法
        data = data.split(/\n/);
        console.log(data);
        data.forEach((ele) => {
            ht.push(ele);
        });
    } else if ("digitAnalyze" === constructor) {
        // 数字分析法
        data = data.split(/\n/);
        data.forEach((ele) => {
            ht.push(ele);
        });
    } else {
        data = data.split(",");

        data.forEach((element) => {
            ht.push(element);
        });
        if(ht.over && ht.over.length !== 0)ht.over.sort();
    }
    console.log(ht.storage);

    document.getElementById("result").innerHTML = ht.toString();
    console.log(ht.queue.toString())
    updateTable();
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

function appendTableCell(key, value) {
    $("#result-table").append(
        '<div id="hashEle_' +
            key +
            '" class="cell"><div class="key">' +
            key +
            '</div><div class="value">' +
            value +
            "</div></div>"
    );
}
$('input[id="cell-width"]').bind({
    "input propertychange": function (e) {
        $("#cell-width").html(
            "body{--cell-width:" + e.currentTarget.value + "%}"
        );
        $('input[id="cell-width"]')[0].value = $(
            'input[id="cell-width"]'
        )[1].value = e.currentTarget.value;
    },
});
function updateTable() {
    let q = ht.queue;
    var i = 0;
    $("#table-cell-animation").html('')
    while (!q.isEmpty()) {
        let ele = q.shift().data.split(",");
        let key = ele[0];
        let value = ele[1];
        if('overArr' === key || 'overList' === key)
        {
            console.log('溢出区->', ht.over.toString())
        }else{
            setTimeout("updateTableCell(" + key + ", '" + value + "')", 1000 * i++);
        }
    }
}
function updateTableCell(key, value) {
    $("#table-cell-animation").append(
        "#result-table{--cell-change-color:red;}" +
            " #hashEle_" +
            key +
            "{" +
            "   animation: table-cell-display 2s infinite;" +
            "   animation-iteration-count: 1;" +
            "   animation-fill-mode: forwards;" +
            "}"
    );
    $("#hashEle_" + key + " .value")[0].textContent = value;
}

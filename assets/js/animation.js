// 效果
function tableAnimation() {
    let q = ht.queue; // 动画队列
    var queue = Promise.resolve();
    var i = 0;
    $("#table-cell-animation").html("");
    while (!q.isEmpty()) {
        let ele = q.shift().data.split(",");
        let key = ele[0];
        let value = ele[1];
        if ("overList" === key || "overArr" === key) {
            // 溢出区
            key = "o" + i++;
            queue = queue.then(() => {
                return promiseFactory(function () {
                    if (0 === $("#hashEle_" + key).length) {
                        // 元素不存在
                        insertOverTableCell(ele[2], key, value);
                    }
                    updateTableCell(key, value);
                });
            });
        } else if ("listAddr" === key) {
            // 链地址
            queue = queue.then(() => {
                return promiseFactory(function () {
                    listAddr_addNode(parseInt(ele[1]), ele[2], ele[3]);
                });
            });
        }else {
            queue = queue.then(() => {
                return promiseFactory(() => {
                    updateTableCell(key, value);
                });
            });
        }
    }
    queue = queue.then(() => {
        return promiseFactory(() => {
            $("#table-cell-animation").html("");
        });
    });
}

// 更新动画和值
function updateTableCell(key, value = null) {
    $("#table-cell-animation").append(
        "#result-table{--cell-change-color:red;}" +
            " #hashEle_" +
            key +
            "{" +
            "   animation: table-cell-display " + animation_delay + "s infinite;" +
            "   animation-iteration-count: 1;" +
            "   animation-fill-mode: forwards;" +
            "   -webkit-animation: table-cell-display " + animation_delay + "s infinite;" +
            "   -webkit-animation-iteration-count: 1;" +
            "   -webkit-animation-fill-mode: forwards;" +
            "}"
    );
    console.log(key, value)
    if (value) $("#hashEle_" + key + " .value")[0].textContent = value;
    console.log(key, value)
}

// 高亮显示找到的元素
function highLightTableCell(selector) {
    $("#table-cell-animation").append(
        "#result-table{--cell-highlight-color:darkorchid;}" +
            selector +
            "{" +
            "   animation: table-cell-highlight 0.3s infinite;" +
            "   animation-fill-mode: backwards;" +
            "   -webkit-animation: table-cell-highlight 0.3s infinite;" +
            "   -webkit-animation-fill-mode: backwards;" +
            "}"
    );
}

// 链地址法与其它模式切换
function listAddrModeSwitch(on = false) {
    if (!on)
        $("#list-cell-fix").html("");
    else
        $("#list-cell-fix").html(
            ".table{flex-direction: column;}" +
                ".table .list {display: flex;}" +
                ".table .cell {width: var(--cell-width, 12vw);}" +
                ".table .list {width: 100%;}" +
                "}"
        );
}

/**
 * 链地址法添加节点
 * @param {*} index 链地址
 * @param {*} pos 插入链表的位置序号
 * @param {*} value 值
 */
function listAddr_addNode(index = 0, pos = 1, value = ""){
    // list_index
    $(
        '<div id="hashEle_l' +
            index +
            '" class="cell"><div class="key">' +
            pos +
            '</div><div class="value">' +
            value +
            '</div></div>'
    ).insertAfter("#result-table > div:nth-child(" + (index + 1) + ") > div:nth-child(" + pos + ")");
    // #result-table > div:nth-child(13) > div
    updateTableCell('l' + index)
}

// 插入元素
function insertOverTableCell(index, key, value) {
    if (null === $("#result-table-over")[0].firstElementChild) {
        $("#result-table-over").append(
            '<div id="list_' +
                key +
                '" class="list"><div id="hashEle_' +
                key +
                '" class="cell"><div class="key">' +
                key +
                '</div><div class="value">' +
                value +
                "</div></div></div>"
        );
    } else {
        $(
            '<div id="list_' +
                key +
                '" class="list"><div id="hashEle_' +
                key +
                '" class="cell"><div class="key">' +
                key +
                '</div><div class="value">' +
                value +
                '</div></div></div>'
        ).insertAfter("#result-table-over > div:nth-child(" + index + ")");
    }
    $("#table-cell-animation").append(
        "#result-table{--cell-change-color:red;}" +
            " #hashEle_o" +
            key +
            "{" +
            "   animation: table-cell-display 2s infinite;" +
            "   animation-iteration-count: 1;" +
            "   animation-fill-mode: forwards;" +
            "}"
    );
}

function appendTableCell(key, value) {
    $("#result-table").append(
        '<div id="list_' +
            key +
            '" class="list"><div id="hashEle_' +
            key +
            '" class="cell"><div class="key">' +
            key +
            '</div><div class="value">' +
            value +
            "</div></div></div>"
    );
}
function promiseFactory(r) {
    return new Promise((resolve, reject) => {
        r();
        setTimeout(() => {
            resolve();
        }, animation_delay * 1000);
    });
}
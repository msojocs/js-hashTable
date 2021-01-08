// 更新动画和值
function updateTableCell(key, value = null) {
    $("#table-cell-animation").append(
        "#result-table{--cell-change-color:red;}" +
            " #hashEle_" +
            key +
            "{" +
            "   animation: table-cell-display 2s infinite;" +
            "   animation-iteration-count: 1;" +
            "   animation-fill-mode: forwards;" +
            "   -webkit-animation: table-cell-display 2s infinite;" +
            "   -webkit-animation-iteration-count: 1;" +
            "   -webkit-animation-fill-mode: forwards;" +
            "}"
    );
    if (value) $("#hashEle_" + key + " .value")[0].textContent = value;
}

function highLightTableCell(selector) {
    $("#table-cell-animation").append(
        "#result-table{--cell-highlight-color:darkorchid;}" +
            selector +
            "{" +
            "   animation: table-cell-highlight 5s infinite;" +
            "   animation-fill-mode: backwards;" +
            "   -webkit-animation: table-cell-highlight 5s infinite;" +
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
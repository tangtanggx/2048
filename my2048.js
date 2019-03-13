
var my2048;
var rows = 4;
var cols = 4;
var padding = 12;
var squareWidth = 100;
var defaultSquare = []; // 默认小方块数组
var square = []; // 随机生成方块数组
var squareVal = []; // 小方块的值
var squareColor = { "0": "#dbd2c8", "2": "#eee4da", "4": "#ede0c8", "8": "#f2b179", "16": "#f59563", "32": "#f67e5f", "64": "#f65e3b", "128": "#edcf72", "256": "#edcc61", "512": "#9c0", "1024": "#33b5e5", "2048": "#09c", "4096": "#5b67ff" };
var lock = true;
var isChange = false;

function repaint(newSquare) {
    square = getNullSquare();
    var newSquareVal = getNullSquare();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (newSquare[i][j]) {
                if (newSquare[i][j].next) {
                    var temp = createSquare(newSquare[i][j].num * 2, i, j);
                    square[i][j] = temp;
                    my2048.append(temp);
                    my2048.removeChild(newSquare[i][j].next);
                    my2048.removeChild(newSquare[i][j]);
                } else {
                    var temp = createSquare(newSquare[i][j].num, i, j);
                    square[i][j] = temp;
                    my2048.append(temp);
                    my2048.removeChild(newSquare[i][j]);
                }
                if (squareVal[i][j] != square[i][j].num) {
                    isChange = true;
                }
                newSquareVal[i][j] = square[i][j].num;
            } else {
                newSquareVal[i][j] = 0;
            }
        }
    }
    squareVal = newSquareVal;
}

function animation(newSquare) {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (newSquare[i][j]) {
                var left = j * squareWidth + (j + 1) * padding;
                var top = i * squareWidth + (i + 1) * padding;
                newSquare[i][j].style.left = left + 'px';
                newSquare[i][j].style.top = top + 'px';
                if (newSquare[i][j].next) {
                    newSquare[i][j].next.style.left = left + 'px';
                    newSquare[i][j].next.style.top = top + 'px';
                }
            }
        }
    }
}

function handleArr(arr) {
    var temp = [];
    if (arr.length > 0) {
        temp.push(arr[0]);
        for (var i = 1; i < arr.length; i++) {
            if (arr[i].num == temp[temp.length - 1].num && !temp[temp.length - 1].next) {
                temp[temp.length - 1].next = arr[i];
            } else {
                temp.push(arr[i]);
            }
        }
    }
    return temp;
}

function getNullSquare() {
    var temp = [];
    for (var i = 0; i < rows; i++) {
        temp[i] = [];
        for (var j = 0; j < cols; j++) {
            temp[i][j] = null;
        }
    }
    return temp;
}

function getNewSquare(direction) {
    // 获取一个空的方块数组
    var newSquare = getNullSquare();
    if (direction == 'ArrowLeft') {
        for (var i = 0; i < rows; i++) {
            var temp = [];
            for (var j = 0; j < cols; j++) {
                if (square[i][j] != null) temp.push(square[i][j]);
                temp = handleArr(temp);
                for (var k = 0; k < cols; k++) {
                    if (temp[k]) newSquare[i][k] = temp[k];
                }
            }
        }
    } else if (direction == 'ArrowRight') {
        for (var i = 0; i < rows; i++) {
            var temp = [];
            for (var j = cols - 1; j >= 0; j--) {
                if (square[i][j] != null) temp.push(square[i][j]);
                temp = handleArr(temp);
                for (var k = cols - 1; k >= 0; k--) {
                    if (temp[cols - 1 - k]) newSquare[i][k] = temp[cols - 1 - k];
                }
            }
        }
    } else if (direction == 'ArrowUp') {
        for (var j = 0; j < cols; j++) {
            var temp = [];
            for (var i = 0; i < rows; i++) {
                if (square[i][j] != null) temp.push(square[i][j]);
                temp = handleArr(temp);
                for (var k = 0; k < rows; k++) {
                    if (temp[k]) newSquare[k][j] = temp[k];
                }
            }
        }
    } else if (direction == 'ArrowDown') {
        for (var j = 0; j < cols; j++) {
            var temp = [];
            for (var i = rows - 1; i >= 0; i--) {
                if (square[i][j] != null) temp.push(square[i][j]);
                temp = handleArr(temp);
                for (var k = rows - 1; k >= 0; k--) {
                    if (temp[rows - 1 - k]) newSquare[k][j] = temp[rows - 1 - k];
                }
            }
        }
    }
    return newSquare;
}

function move(direction) {
    if (isOver()) {
        alert("game over");
        return;
    }
    var newSquare = getNewSquare(direction);
    animation(newSquare);
    setTimeout(function () {
        repaint(newSquare);
        if (isChange) {
            randNumSquare();
        }
        lock = true;
        isChange = false;
    }, 300);

}

function isOver() {
    for (var i = 0 ; i < rows ; i ++) {
        for (var j = 0 ; j < cols ; j ++) {
            // 只要有一个位置是null，游戏就不会结束
            if (square[i][j] == null) {
                return false;
            }
            // 有一个方块的值 = 后面方块的值 或者 下面方块的值
            if (square[i][j + 1] && square[i][j].num == square[i][j + 1].num || square[i + 1] && square[i + 1][j] && square[i][j].num == square[i + 1][j].num){
                return false;
            }
        }
    }
    return true;
}

function bandEvent() {
    document.addEventListener('keydown', function (e) {
        if (!lock) return;
        lock = false;
        move(e.key);
    });
}

function randNumSquare() {
    for (; ;) {
        var row = Math.floor(Math.random() * rows);
        var col = Math.floor(Math.random() * cols);
        if (squareVal[row][col] == 0) {
            var val = Math.random() > 0.5 ? 2 : 4;
            var temp = createSquare(val, row, col);
            squareVal[temp.row][temp.col] = temp.num;
            square[temp.row][temp.col] = temp;
            my2048.appendChild(temp);
            return true;
        }
    }
}

function createSquare(val, row, col) {
    var temp = document.createElement('div');
    var left = col * squareWidth + (col + 1) * padding;
    var top = row * squareWidth + (row + 1) * padding;
    temp.style.width = squareWidth + 'px';
    temp.style.height = squareWidth + 'px';
    temp.style.left = left + 'px';
    temp.style.top = top + 'px';
    temp.style.backgroundColor = squareColor[val];
    temp.style.lineHeight = squareWidth + 'px';
    temp.style.fontSize = squareWidth * 0.4 + 'px';
    if (val > 0) temp.innerText = val;
    temp.num = val;
    temp.row = row;
    temp.col = col;
    return temp;
}

function generateDefaultSquare() {
    for (var i = 0; i < rows; i++) {
        defaultSquare[i] = [];
        square[i] = [];
        squareVal[i] = [];
        for (var j = 0; j < cols; j++) {
            squareVal[i][j] = 0;
            square[i][j] = null;
            defaultSquare[i][j] = createSquare(0, i, j);
            my2048.appendChild(defaultSquare[i][j]);
        }
    }
}

function initBox() {
    my2048 = document.getElementById('my2048');
    my2048.style.width = cols * squareWidth + (cols + 1) * padding + 'px';
    my2048.style.height = rows * squareWidth + (rows + 1) * padding + 'px';
}

function init() {
    // 初始化盒子
    initBox();
    // 生成默认小方块
    generateDefaultSquare();
    // 随机生成两个带数字的方块
    randNumSquare();
    randNumSquare();
    // 绑定键盘事件
    bandEvent();
}

window.onload = function () {
    init();
}
'use strict'

//var cell = ''
const MINE = '💣'
const FLAG = '🚩'
//////////

var gInterval;
var minutes = 0;
var seconds = 0;
var tens = 0;
var appendTens = document.getElementById("tens")
var appendSeconds = document.getElementById("seconds")
var appendMinutes = document.getElementById("minutes")



var gCounter = 0
var gBoard = []

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame(size, minescount) {


    appendTens.innerHTML='0'
    appendSeconds.innerHTML='0'
    appendMinutes.innerHTML='0s'
    


    clearInterval(gInterval);
    gInterval = null;
    minutes = 0;
    seconds = 0;
    tens = 0;

    gGame.isOn = true

    gLevel.SIZE = size
    gLevel.MINES = minescount

    //gGame.isOn=true
    gBoard = buildBoard(size);
    placeMines(minescount)
    console.table(gBoard)
    setMinesNegsCount();
    renderBoard(gBoard);
}


function buildBoard(size) {



    var board = new Array();
    for (var i = 0; i < size; i++) {

        board[i] = new Array();
        for (var j = 0; j < size; j++) {
            var cell = {
                id: gCounter++,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                negs:[]
            }
            board[i][j] = cell
        }
    }
    return board

}

function renderBoard(board) {
    if (gGame.isOn) {
        var strHtml = '';
        for (var i = 0; i < board.length; i++) {
            var row = board[i];
            strHtml += '<tr>';
            for (var j = 0; j < row.length; j++) {
                if (board[i][j].isShown) {

                    var content = board[i][j].isMine ? MINE : board[i][j].minesAroundCount
                    var className = 'cell';
                }
                else if (board[i][j].isMarked) {
                    var content = FLAG
                    var className = 'cell hidden';
                }
                else {
                    var content = '';
                    var className = 'cell hidden';

                }

                var tdId = board[i][j].id;
                strHtml += '<td id="' + tdId + '" onclick="cellClicked(this,' + i + ',' + j + ')" oncontextmenu ="cellMarked(this,' + i + ',' + j + ')" ' +
                    'class="    ' + className + '">' + content + '</td>';

                content = ''
            }
            strHtml += '</tr>';
        }
        var elMat = document.querySelector('.game-board');
        elMat.innerHTML = strHtml;
        //console.log('r')

        var cells = document.querySelectorAll(".cell")
        for (var i = 0; i < cells.length; i++) {
            cells[i].addEventListener('contextmenu', function (event) {
                event.preventDefault();
                return false;
            }, false);

        }
    }

}

function placeMines(count) {

    for (var i = 0; i < count; i++) {

        // gBoard[1][0].isMine = true
        // gBoard[2][0].isMine = true



        gBoard[getRandomInt(0, gBoard.length)][getRandomInt(0, gBoard.length)].isMine = true

    }

}


function cellClicked(elCell, i, j) {
    if (gGame.isOn) {

        // if (gInterval !== null) {
        //     clearInterval(gInterval);
        //     gInterval = null;
        // }

        if (gInterval === null && gGame.isOn) {

            gInterval = setInterval(startTimer, 10)
        }


        if (!gBoard[i][j].isMarked) {

            gBoard[i][j].isShown = true //model
            gGame.shownCount++//= gGame.shownCount + 1

            renderBoard(gBoard)
            if (gBoard[i][j].isMine) { endGame(false) }
            checkGameOver()
            expandShown(gBoard, elCell, i, j)
        }
    }
}

// var gGame = {
//     isOn: true,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
// }



function cellMarked(elCell, i, j) {
    if (gGame.isOn) {
        // if (gInterval !== null) {
        //     clearInterval(gInterval);
        //     gInterval = null;
        // }

        if (gInterval === null && gGame.isOn) {

            gInterval = setInterval(startTimer, 10)
        }


        if (gBoard[i][j].isShown === false) {
            if (gBoard[i][j].isMarked === false) {
                gBoard[i][j].isMarked = true
                gGame.markedCount = gGame.markedCount + 1
            }
            else {
                gBoard[i][j].isMarked = false
                gGame.markedCount = gGame.markedCount - 1
            }
        }
        renderBoard(gBoard)
        checkGameOver()
    }

}


function  expandShown(board, elCell, i, j){

    // console.log(board[i][j])
    // // console.log(elCell.negs.length)

    // for (var i=1;i<board[i][j].negs.length;i++){

    //     board[i][j].negs[i].isShown=true;
    // }
    // renderBoard(gBoard);

}



function countAroundSpecificCell(mat, rowIdx, colIdx) {
    var currentCell = mat[rowIdx][colIdx]
    var counter = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var checkedCell = mat[i][j]
            if (checkedCell.isMine === true) {
                counter = counter + 1                
            }

        }
    }
    return counter
}

function setMinesNegsCount() {
    var counter = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = countAroundSpecificCell(gBoard, i, j)
        }
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function startTimer() {
    tens++;

    if (tens < 9) {
        appendTens.innerHTML = "0" + tens;
    }

    if (tens > 9) {
        appendTens.innerHTML = tens;

    }

    if (tens > 99) {
        seconds++;
        gGame.secsPassed++
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
        appendSeconds.innerHTML = seconds;
    }
    if (seconds > 60) {//minute


        minutes++
        appendMinutes.innerHTML = minutes;
        seconds = 0
        appendSeconds.innerHTML = "0" + 0;

    }
}

function checkGameOver() {

    //     o WIN: all the mines are flagged, and all the other cells are
    // shown
    // console.log(gGame.shownCount)
    // console.log(gLevel.SIZE ** 2-gLevel.MINES)
    //  console.log(gGame.markedCount)
    //  console.log(gLevel.MINES)
    // console.log(gGame.shownCount)
    //console.log('gGame.shownCount :' + gGame.shownCount + ' size-2: ' + gLevel.SIZE ** 2 - gLevel.MINES + ' gGame.markedCount : ' + gGame.markedCount + ' gLevel.MINES: ' + gLevel.MINES)
    if (gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES && gGame.markedCount === gLevel.MINES) {
        endGame(true)
    }


}

function endGame(loseOrWin) {
    if (!loseOrWin) { console.log('sorry') }
    else { console.log('win') }
    gGame.isOn = false
    clearInterval(gInterval)
    gInterval = null


}
/////////////////////////////

// function setTimer() {
//     document.querySelector('.timer').innerHTML = second + ":" + second / 100;
//     second++;

// }






//V// initGame()
//V// buildBoard()
//v// setMinesNegsCount(board)
//V// renderBoard(board)
//V// cellClicked(elCell, i, j)
//V// cellMarked(elCell)
//V// checkGameOver()
// expandShown(board, elCell, i, j)

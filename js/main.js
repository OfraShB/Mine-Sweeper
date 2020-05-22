'use strict'

const MINE = '💣'
const FLAG = '🚩'

var gInterval;
var minutes = 0;
var seconds = 0;
var tens = 0;
var gIsFirstClick
var gLives

var appendTens = document.getElementById("tens")
var appendSeconds = document.getElementById("seconds")
var appendMinutes = document.getElementById("minutes")

var gSafeCounter = 0
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


    gIsFirstClick = true;
    appendTens.innerHTML = '0'
    appendSeconds.innerHTML = '0'
    appendMinutes.innerHTML = '0'



    clearInterval(gInterval);
    gInterval = null;
    minutes = 0;
    seconds = 0;
    tens = 0;
    gLives = 3
    gSafeCounter = 3

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    gLevel.SIZE = size
    gLevel.MINES = minescount


    var state = document.querySelector('.smily-state')
    state.innerHTML = 'Let\'s play 😀!'

    if (size > 4) {

        gLives = 3

        var hearts = document.querySelectorAll(".heart")

        for (var i = 0; i < hearts.length; i++) {
            hearts[i].style.display = 'block'
        }
    }
    else {

        gLives = 1

        var heart1 = document.querySelector('._1')
        var heart2 = document.querySelector('._2')
        var heart3 = document.querySelector('._3')
        heart1.style.display = 'block'
        heart2.style.display = 'none'
        heart3.style.display = 'none'
    }

    var msg = document.querySelector('.safe-message')
    msg.innerHTML = gSafeCounter + ' clicks available'

    var bestTime = document.querySelector('.best-time')
    bestTime.innerHTML = 'Best Time Is...'

    gBoard = buildBoard(gLevel.SIZE);

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
                emptyNegs: []
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
                content = (content === 0) ? '' : content

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

function placeMines() {

    for (var i = 0; i < gLevel.MINES; i++) {

        var legalMinePlace = false

        while (!legalMinePlace) {

            var iIndex = getRandomInt(0, gBoard.length)
            var zIndex = getRandomInt(0, gBoard.length)
            if (gBoard[iIndex][zIndex].isShown === false && gBoard[iIndex][zIndex].isMine === false) {
                gBoard[iIndex][zIndex].isMine = true
                legalMinePlace = true
            }
        }

    }

}


function cellClicked(elCell, i, j) {
    if (gGame.isOn) {


        if (gInterval === null && gGame.isOn) {

            gInterval = setInterval(startTimer, 10)
        }

        if (gIsFirstClick) {

            placeMines()

            setMinesNegsCount();

            gIsFirstClick = false
        }


        if (!gBoard[i][j].isMarked) {

            gBoard[i][j].isShown = true
            gGame.shownCount++

            //console.log(gGame.shownCount)

            renderBoard(gBoard)

            checkGameOver(i, j, true)
            expandShown(gBoard, elCell, i, j)
        }
    }
}

function cellMarked(elCell, i, j) {
    if (gGame.isOn) {


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

        //console.log('marked : ' + gGame.markedCount)


        renderBoard(gBoard)
        checkGameOver(i, j,true)
    }

}


function expandShown(board, elCell, i, j) {

    for (var ind = 0; ind < board[i][j].emptyNegs.length; ind++) {


        if (board[i][j].emptyNegs[ind].isShown === false && board[i][j].emptyNegs[ind].isMarked ===false) {

            board[i][j].emptyNegs[ind].isShown = true;
            gGame.shownCount++
            //console.log(gGame.shownCount)
        }
    }
    renderBoard(gBoard);
    checkGameOver(i, j, false)

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
            else {

                currentCell.emptyNegs.push(checkedCell)
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
    if (seconds > 60) {
        minutes++
        appendMinutes.innerHTML = minutes;
        seconds = 0
        appendSeconds.innerHTML = "0" + 0;

    }
}


function safeClick() {

    if (gBoard.length === 0) return

    var legalSafePlace = false

    while (!legalSafePlace) {

        var iIndex = getRandomInt(0, gBoard.length)
        var zIndex = getRandomInt(0, gBoard.length)
        if (gBoard[iIndex][zIndex].isShown === false && gBoard[iIndex][zIndex].isMine === false) {
            gBoard[iIndex][zIndex].isShown = true
            renderBoard(gBoard)
            renderBoard(gBoard)
            setTimeout(function () {
                gBoard[iIndex][zIndex].isShown = false;
                renderBoard(gBoard)
            }, 1000);
            legalSafePlace = true

        }
    }

    gSafeCounter--
    var msg = document.querySelector('.safe-message')

    if (gSafeCounter === 0) {
        msg.innerHTML = 'no more clicks available'
    }
    else {
        msg.innerHTML = gSafeCounter + ' clicks available'
    }
}

function checkGameOver(rowC, colC, isCalledByClicked) {

    var sts = gLevel.SIZE ** 2 - gLevel.MINES
       
    console.log('lives left: '+gLives)
    console.log(' mines: '+gLevel.MINES+' flagged: '+gGame.markedCount )
    console.log(' suppose to be shown: '+ sts +' shown: '+gGame.shownCount)
    

    if (isCalledByClicked) {

        if (gBoard[rowC][colC].isMarked === false) {
            if (gBoard[rowC][colC].isMine === true) {

                if (gLevel.SIZE === 4) {

                    if (gLives === 0) {
                        //console.log('bakara')
                        endGame(false)
                    }
                    else {
                        gLives--
                        //console.log('bakara')
                        var life = document.querySelector('._1')

                        life.style.display = 'none';
                    }
                }
                else {

                    if (gLives === 1) {

                        var life = document.querySelector('._' + gLives)

                        life.style.display = 'none';

                        endGame(false)
                    }
                    else {


                        var life = document.querySelector('._' + gLives)
                        life.style.display = 'none';
                        gLives--

                    }
                }
            }
        }
    }



    //console.log('gGame.shownCount :' + gGame.shownCount + ' size-2: ' + gLevel.SIZE ** 2 - gLevel.MINES + ' gGame.markedCount : ' + gGame.markedCount + ' gLevel.MINES: ' + gLevel.MINES)
    if (gLevel.SIZE === 4) {

        if (gLives === 1) {
            if (gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES && gGame.markedCount === gLevel.MINES) {
                endGame(true)
            }
        }
        else {

            if (gGame.shownCount - 1 === gLevel.SIZE ** 2 - gLevel.MINES && gGame.markedCount + 1 === gLevel.MINES) {
                endGame(true)
            }
        }
    }
    else {

        var diff = 3 - gLives
        if (gGame.shownCount - diff === gLevel.SIZE ** 2 - gLevel.MINES && gGame.markedCount + diff === gLevel.MINES) {
            endGame(true)
        }
    }
}

function endGame(loseOrWin) {
    console.log('f')
    var state = document.querySelector('.smily-state')

    if (!loseOrWin) {

        state.innerHTML = 'whoops...🤯'
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                gBoard[i][j].isShown = true;
            }
        }
        renderBoard(gBoard)
    }
    else {
        console.log('win')
        state.innerText = 'win 😎 !!'

    }
    gGame.isOn = false

    if (loseOrWin) {
        var duration = gGame.secsPassed
        var theBestTime = 0
        //console.log(duration)
        switch (gLevel.SIZE) {
            case 4:
                if (localStorage.getItem('bestScoreBeginner') === null)//if there is no such key:
                {
                    localStorage.setItem('bestScoreBeginner', duration);
                }
                else {
                    if (localStorage.getItem('bestScoreBeginner') > duration) {
                        localStorage.setItem('bestScoreBeginner', duration);
                    }
                }
                theBestTime = localStorage.getItem('bestScoreBeginner')
                break;
            case 8:
                if (localStorage.getItem('bestScoreMedium') === null)//if there is no such key:
                {
                    localStorage.setItem('bestScoreMedium', duration);
                }
                else {
                    if (localStorage.getItem('bestScoreMedium') > duration) {
                        localStorage.setItem('bestScoreMedium', duration);
                    }
                }
                theBestTime = localStorage.getItem('bestScoreMedium')
                break;
            case 12:
                if (localStorage.getItem('bestScoreExpert') === null)//if there is no such key:
                {
                    localStorage.setItem('bestScoreExpert', duration);
                }
                else {
                    if (localStorage.getItem('bestScoreExpert') > duration) {
                        localStorage.setItem('bestScoreExpert', duration);
                    }
                }
                theBestTime = localStorage.getItem('bestScoreExpert')
        }

        //console.log('best score: ')

        var bestTime = document.querySelector('.best-time')
        bestTime.innerHTML = 'Best Time Is: ' + theBestTime + ' seconds!'
    }

    clearInterval(gInterval)
    gInterval = null


}

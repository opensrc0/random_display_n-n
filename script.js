const game = (() => {
    const config = {};
    const globalV = {};

    config.timerStart = 20;
    config.maxRandomNumber = 10;

    globalV.totalScore = 0;
    globalV.row = 3;
    globalV.column = 5;
    globalV.selectedBlock = Math.floor((Math.random() * 3 * 5));

    getRandomNumber = (maxNumber = 10) => {
        return Math.floor((Math.random() * maxNumber));
    }

    startTimer = () => {
        if(!document.querySelector('#timer')) return ;

        let i = config.timerStart;
        let clearTimer = setInterval(() => {
            i--;
            displayTimer(i);
            displayRandomColor();
            displayScore();
            if (i <= 0) {
                globalV.isPlayingGame = false;
                displayGameOver();
                clearInterval(clearTimer);
            }
            if (getHeightestScore() < globalV.totalScore) setHeightestScore();
        }, 1000);
    }

    getHeightestScore = () => {
        return localStorage.getItem('highestScore') || 0;
    }

    setHeightestScore = () => {
        localStorage.setItem('highestScore', globalV.totalScore);
    }

    incrementScore = () => {
        globalV.totalScore = globalV.totalScore + 1;
    }

    decrementScore = () => {
        globalV.totalScore = globalV.totalScore - 1;
    }

    // Ui Display Functions start here
    displayHighestScore = () => {
        document.querySelector('#highestScore').innerHTML = getHeightestScore();
    }

    displayScore = () => {
        document.querySelector('#score').innerHTML = globalV.totalScore;
    }

    displayTimer = (value) => {
        document.querySelector('#timer').innerHTML = value;
    }

    displayRandomColor = () => {
        const rowColumn = globalV.row * globalV.column;
        document.getElementById(`block${globalV.selectedBlock}`).style.background = 'grey';
        globalV.selectedBlock = getRandomNumber(rowColumn);
        document.getElementById(`block${globalV.selectedBlock}`).style.background = 'green';
    }

    displayGameSectionOnly = () => {
        document.querySelector('#userInfo').classList.add('hide');
        document.querySelector('#gameBoard').classList.remove('hide');
    }

    displayGameOver = () => {
        alert('Game Over');
        document.querySelector('#userInfo').classList.remove('hide');
        document.querySelector('#gameBoard').classList.add('hide');
    }
    // Ui display functions ends here

    listener = () => {
        document.querySelector('#startGame').addEventListener("click", () => {
            globalV.isPlayingGame = true;
            displayGameSectionOnly();
            displayTimer(config.timerStart);
            displayScore();
            displayHighestScore();
            startTimer();
        });

        document.querySelector('#startAgain').addEventListener("click", () => {
            document.location.reload(true);
        });

        document.querySelector('#card').addEventListener("click", (e) => {
            if(`block${globalV.selectedBlock}` === e.target.id) {
                incrementScore();
            } else {
                decrementScore();
            }
        });
    }

    getBlockList = () => {
        const rowColumn = globalV.row * globalV.column;
        let blockList = '';

        for(let i = 0; i < rowColumn; i++) {
            blockList += `<div class="grid-item" id="block${i}">${i}</div>`;
        }

        return blockList;
    }

    getGridTemplateColumns = () => {
        let gridTemplateColumns = '';

        for(let i = 0; i <  globalV.column; i++) {
            gridTemplateColumns += `auto `;
        }

        return gridTemplateColumns;
    }

    init = () => {
        const blockList = getBlockList();
        const gridTemplateColumns = getGridTemplateColumns();

        const template = `
            <section id="userInfo">
                <input name="player" placeholder="Player name" />
                <input name="row" placeholder="Enter row" />
                <input name="column" placeholder="Enter column" />
                <button id="startGame">Start Game</button>
            </section>
            <section id="gameBoard" class="hide">
                <header>
                    <div>Time: <span id="timer">30</span></div>
                    <div>Highest Score: <span id="highestScore">0</span>/ Score: <span id="score">0</span></div>
                </header>
                <div id="card" class="grid-container" style="grid-template-columns: ${gridTemplateColumns}">
                   ${blockList}
                </div>
                <div id="answer">
                    <button id="startAgain">Restart</button>
                </div>
            </section>
        `;

        document.querySelector('#app').innerHTML = template;
        listener();
    }

    return {
        init: init,
    }
})();

game.init();
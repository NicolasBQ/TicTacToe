const swup = new Swup();

//Clean


swup.on('contentReplaced', mount);

function mount() {
//Player
   if(document.querySelector('.score-container')) {
        playerOne();
        const player = (sign) => { //Will define the players
            this.sign = sign;
            const getSign = () => {
                return sign
            }
            return {getSign}
        };
//Gameboard
        const gameboard = (() => { //Will define the array 
            let _gameboard = ["", "", "", "", "", "", "", "", ""];

            const setGameboard = (index, sign) => {
                _gameboard[index] = sign;
                console.log(_gameboard)
            }

            const getGameboard = (index) => {
                return _gameboard[index]
            }

            const reset = () => {
                _gameboard.splice(0);
                console.log(_gameboard)
            }

            return {setGameboard, getGameboard, reset}

        })();
//Display Controller
        const displayController = (() => { //Will define the DOM events
            let fieldElements = document.querySelectorAll('.field');
            let resetGame = document.querySelector('.reset-gameboard');
            let currentName = document.querySelector('.current-player')
            let playerOne = document.querySelector('.player-one');
            let playerTwo = document.querySelector('.player-two')

            fieldElements.forEach((field) => {
                field.addEventListener('click', (e) => {
                    if(e.target.textContent != '' || gameController.getIsOver()) return;
                    gameController.playRound(e.target.dataset.index)
                })
            })

            const domGameboard = (index) => {
                fieldElements[index].textContent = gameboard.getGameboard(index);
                if(gameboard.getGameboard(index) === 'X') {
                    fieldElements[index].style.color = '#39F01F'
                } else {
                    fieldElements[index].style.color = '#00EAD3'
                }
            }

            const turnMessage = (name, style) => {
                currentName.innerText = name + "'s turn";
                currentName.style.color = style;
            }

            const resultMessage = (sign) => {
                if(sign === 'X') {
                    currentName.innerText = playerOne.innerText;
                }
                if(sign === 'O') {
                    currentName.innerText = playerTwo.innerText;
                }
                if(sign === 'Draw') {
                    currentName.innerText = 'Draw'
                }
            }

            resetGame.addEventListener('click', () => {
                gameboard.reset();
                gameController.reset();
                for(let i = 0; i < fieldElements.length; i++) {
                    domGameboard(i);
                }
            })

            return{domGameboard, turnMessage, resultMessage}
        })();
//Game Controller
        const gameController = (() => { //Will define the gameflow
            let round = 1;
            let name;
            let x = player('X');
            let o = player('O');
            let isOver = false;

            const playRound = (index) => {
                gameboard.setGameboard(index, currentPlayerSign())
                if(checkWinner(index)) {
                    console.log('win');
                    displayController.resultMessage(currentPlayerSign())
                    isOver = true;
                    return;
                }
                if(round === 9) {
                    displayController.resultMessage('Draw');
                    isOver = true;
                    return;
                }
                displayController.domGameboard(index);
                turnName();
                round++;
            };

            const currentPlayerSign = () => {
                return round % 2 === 1 ? x.getSign() : o.getSign();
            }

            const turnName = () => {
                if(round % 2 !== 1) {
                    name = document.querySelector('.player-one').innerText;
                    displayController.turnMessage(name, '#39F01F');
                }
                else {
                    name = document.querySelector('.player-two').innerText;
                    displayController.turnMessage(name, '#00EAD3')
                }
            }

            const checkWinner = (index) => {
                const winconditions = [
                    [0, 1, 2],
                    [3, 4, 5],
                    [6, 7, 8],
                    [0, 3, 6],
                    [1, 4, 7],
                    [2, 5, 8],
                    [0, 4, 8],
                    [2, 4, 6]
                ];

                return winconditions.filter((combinations) => combinations.includes(index)).some((possibleCombination) => possibleCombination.every((index) => gameboard.getGameboard(index) === currentPlayerSign()
                )
                );
            }

            const getIsOver = () => {
                return isOver;
            }
            
            const reset = () => {
                round = 1;
                isOver = false;
                name = document.querySelector('.player-one').innerText;
                displayController.turnMessage(name, '#39F01F');
            }
            return {playRound, getIsOver, reset};
        })();
   }
}

//Alert for player one
const playerOne = async function() {
    const { value: playerXName } = await Swal.fire({
        title: 'Player 1 name',
        input: 'text',
        inputPlaceholder: 'Player X name',
        showCancelButton: false,
        background: '#333336',
        confirmButtonText: 'CONTINUE',
        confirmButtonColor: '#333336',
        customClass: {
            title: 'alert-content',
            input: 'alert-input',
            confirmButton: 'alert-confirm',
        },
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          } else {
            document.querySelector('.player-one').innerText = value ;
            playerTwo();
            document.querySelector('.current-player').innerText = value + "'s turn"
          }
        }
      });
}
//Alert for player two
const playerTwo = async function() {
    const {value: playerOName} = await Swal.fire({
        title: 'Player 2 name',
        input: 'text',
        inputPlaceholder: 'Player O name',
        showCancelButton: false,
        background: '#333336',
        confirmButtonText: 'Play',
        confirmButtonColor: '#333336',
        customClass: {
            title: 'alert-content',
            input: 'alert-input',
            confirmButton: 'alert-confirm',
            cancelButton: 'alert-confirm',
        },
        inputValidator: (value) => {
            if(!value) {
                return 'You need to write something!'
            } else {
                document.querySelector('.player-two').innerText = value;
            }
        }
    })
}



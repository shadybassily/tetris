document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.getElementById("score");
  const startBtn = document.getElementById("start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let colors = ["black", "red", "pruple", "green", "blue"];

  //The lTetromino
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2], //first rotation
    [width, width + 1, width + 2, width * 2 + 2], //second rotation
    [1, width + 1, width * 2 + 1, width * 2], //third rotation
    [width, width * 2, width * 2 + 1, width * 2 + 2], //fourth rotation
  ];

  //The zTetromino
  const zTetromino = [
    [1, 2, width, width + 1],
    [0, 1, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 2],
    [1, width, width + 1, width * 2],
  ];

  //The tTetromino
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width * 2 + 1, width + 1, width + 2],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  //The oTetromino
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  //The iTetromino
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentPosition = 4;
  let currentRotation = 0;

  //selecting a random tetromino
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation]; //[1, 11, 21, 2]

  //draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      //squares[6]
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //moving the tetromino down every second
  // timerId = setInterval(moveDown, 1000)

  //controlling the termino
  function control(e) {
    if (scoreDisplay.innerHTML !== "end") {
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 38) {
        rotate();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      }
    }
  }

  document.addEventListener("keyup", control);

  //movedown
  function moveDown() {
    if (timerId) {
      undraw();
      currentPosition += width;
      draw();
      freeze();
    }

    console.log(currentPosition);
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //start a new tetromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      addScore();
      draw();
      displayShape();
      gameOver();
    }
  }

  //moving left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    console.log(isAtLeftEdge);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //moving right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //rotate tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation == current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  //show the next tetromino in the mini-grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  //the tetromino without rotation
  const upNextTetromino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //ltetromino
    [1, 2, displayWidth, displayWidth + 1], //ztetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //ttetromino
    [0, 1, displayWidth, displayWidth + 1], //otetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //itetromino
    ,
  ];

  //display the next tetromino in the mini-grid
  function displayShape() {
    //remove any trace of tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetromino[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //start/pause
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  function addScore() {
    for (let i = 0; i < 199; i += 10) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";

      clearInterval(timerId);
    }
  }
});

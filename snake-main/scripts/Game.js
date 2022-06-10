import Food from './Food.js'
import Snake from './Snake.js';

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
}

export default class Game {
  constructor() {
    this.entity = 'Game';
    this.playing= false;

    const canvas = document.querySelector('#game');
    this.context = canvas.getContext('2d');

    this.context.fillRect(0, 0, 540, 540);

    this.cellSize = 30;
    this.cellCount = Math.floor(canvas.width / this.cellSize);
    this.generateGrid()

    this.gameInputs = new Set(
      ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    )
    this.direction = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'

    }
    this.initEventListeners()
  }

  spawnFood() {
    let randomX = getRandomNumber(0, this.cellCount - 1);
    let randomY = getRandomNumber(0, this.cellCount - 1);

    console.log('RANDOM', randomX, randomY)
    while(this.snake.segments.some(segment=> {
      return segment.x === randomX && segment.y === randomY
    })) {
      console.log ('RIGENERO X E Y')
      randomX = getRandomNumber(0, this.cellCount -1);
      randomY = 2
    }
    this.food = new Food(randomX,randomY, '#00ff00');
    this.renderFood();
  }

  renderFood() {
    this.context.fillStyle = this.food.color;
    const posX = this.food.x * this.cellSize;
    const posY = this.food.y * this.cellSize;
    this.context.fillRect(posX, posY, this.cellSize, this.cellSize);
  }

  spawnSnake() {
    const initialLength = 4;

    const headX = 1;
    const headY = 1;

    const tailX = headX + (initialLength -1);
    const tailY = headY + (initialLength -1);
    
    console.log('HEAD:', headX, headY, 'TAIL:', tailX, tailY)

    this.snake = new Snake();
    this.snake.createSegments(headX, headY, tailX, tailY);

    this.renderSnake()
  }

  renderSnake() {
    // questo è il nostro array
    // segments = [
    //   { x: 0, y: 0 },
    //   { x: 30, y: 0 },
    //   { x: 60, y: 0 }
    // ];

    this.snake.segments.forEach((segment, index) => {
      // this.snake.segments[index] -> ciclo for
      // segment -> ciclo forEach
      this.context.fillStyle = this.snake.color;
      const posX = segment.x * this.cellSize;
      const posY = segment.y * this.cellSize;
      this.context.fillRect(posX, posY, this.cellSize, this.cellSize);

    });
  }

  generateGrid() {
    this.context.fillStyle ='#000';
    this.context.fillRect(0, 0, 540, 540);
    this.context.strokeStyle = '#fff';
    for (let row = 0; row < this.cellCount; row++) {
      this.context.beginPath();
      this.context.moveTo(0, row * this.cellSize);
      this.context.lineTo(540, row * this.cellSize);
      this.context.stroke();
    }

    for (let column = 0; column < this.cellCount; column++) {
      this.context.beginPath();
      this.context.moveTo(column * this.cellSize, 0);
      this.context.lineTo(column * this.cellSize, 540);
      this.context.stroke();
    }
  }

  play() {
    this.playing = true;
    this.spawnSnake()
    this.spawnFood()
    this.speed = 100;
    this.updateAttachedToContext = this.update.bind(this)
    this.interval = window.setInterval(
      this.updateAttachedToContext, //funzione
      this.speed // tempo ms
    );
  }
  createInterval(){
    window.clearInterval(this.interval)
    return window.setInterval(
      this.updateAttachedToContext,
      this.speed
    )
  }
  update() {
    const head = {...this.snake.segments[0]};
    const direction = this.snake.direction;


    switch (direction){
      case 'left':
        if(head.x <= 0){
          head.x = this.cellCount
        }
        head.x = head.x - 1;
        break;
      case 'right':
        head.x = head.x + 1;
        if(head.x  >= this.cellCount){
          head.x = 0;
        }
        break;
      case 'up':
        if(head.y <= 0){
          head.y = this.cellCount
        }
        head.y = head.y - 1;
        break;
      case 'down':
        head.y = head.y + 1;
        if( head.y >= this.cellCount){
          head.y = 0
        }
        break;
    }
    const hasEaten = head.x === this.food.x && head.y === this.food.y
    if(hasEaten){
      delete this.food;
      this.spawnFood()
    }
    const tail = this.snake.segments.slice(1)
    const hasCollision = tail.some((segment) => {return head.x === segment.x && head.y === segment.y})
    console.log(hasCollision)
    if(hasCollision){
      this.endGame()
      return false;
    }
    
    this.snake.move(head, hasEaten)
    this.renderAnimation()
  }
  endGame(){
    clearInterval(this.interval);
    this.context.clearRect(0, 0, 540, 540)
    this.generateGrid()
    
  }
  renderAnimation(){
    this.context.clearRect(0, 0, 540, 540)
    this.generateGrid()
    this.renderSnake()
    this.renderFood()
  }
  initEventListeners(){
    const handleInputs = (event) =>{
      
      if(event.code === 'Space'){
        this.play()
      }
      if(!this.playing){
        return false;
      }
      const direction = this.direction[event.code]
      this.snake.setDirection(direction)
    }
    document.addEventListener('keydown', handleInputs)
  }

  testCanvas() {
    // metto colore giallo
    this.context.fillStyle = '#ffff00';

    // rettangolo pieno grande tutto 540 x 540
    this.context.fillRect(0,0,540,540);

    // cambio colore
    this.context.fillStyle = '#000000';

    // rettangolo pieno da x 0 y 0 a 540/2 (metà)
    this.context.fillRect(0, 0, 270, 270);
    // cambio colore
    this.context.fillStyle = '#ff00ff';

    // rettangolo pieno da x 270 y 270 a 540/2 (metà)
    this.context.fillRect(270, 270, 270, 270);
  }
}
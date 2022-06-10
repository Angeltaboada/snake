export default class Food {
  constructor(x, y, yellow) {
    this.entity = 'Food';
    this.x = x;
    this.y = y;
    this.color = 'yellow';
  }
}


// new Food(20, 30) // x, y

// const food1 = new Food() //-> parte il constructor
// console.log(food1.entity) // -> Food
// console.log(food1.x) // -> 10
// food1.logPosition(); // -> 10


// Food = {
//   entity: 'Food',
//   x: 10,
//   logPosition() {
//     console.log(this) // { entity: 'Food', x: 10, logPosition: function }
//   }
// }



// // new Food().changeColor()
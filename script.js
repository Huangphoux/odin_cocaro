let hamster = {
    stomach: [],

    eat(food) {
        // this.stomach.push(food);
        this.stomach = [food]
    },
};

let speedy = {
    __proto__: hamster,
    // stomach: [],
};

let lazy = {
    __proto__: hamster,
    // stomach: [],
};

// This one found the food
speedy.eat("apple");
console.log(speedy.stomach); // apple

// This one also has it, why? fix please.
console.log(lazy.stomach); // apple

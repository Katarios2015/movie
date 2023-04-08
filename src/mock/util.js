const getRandomArrayElement = (items) => {
    const randElement = items[Math.floor(Math.random() * items.length)];
    return randElement;
};



const getRandomCeilNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randCeilNumber = Number(Math.floor(Math.random() * (max - min) + min));
    return randCeilNumber;
};



const getRandomNumber = (min, max) => {
    const randNumber = Number((Math.random() * (max - min) + min).toFixed(1));
    return randNumber;
};


const getRandomArray = (someArray, minLength, maxLength) => {
    const randArrayLength = getRandomCeilNumber (minLength, maxLength);
    let newMass = [];

    for(let i = 0; i<= randArrayLength; i++) {
        newMass[i] = getRandomArrayElement(someArray);
    }
    return newMass;
};

export {getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray};
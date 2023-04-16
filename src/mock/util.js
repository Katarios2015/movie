const getRandomArrayElement = (items) => {
    const randElement = items[Math.floor(Math.random() * items.length)];
    return randElement;
};



const getRandomCeilNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.ceil(max);
    const randCeilNumber = Number(Math.round(Math.random() * (max - min) + min));
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

const getTimeFormat = (minutes) => {
    const hours = Math.floor(minutes/60);
    const restMinutes = minutes%60;

    const timeFormat = `${hours}h ${restMinutes}m`;
    return timeFormat;
};

export {getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray, getTimeFormat};
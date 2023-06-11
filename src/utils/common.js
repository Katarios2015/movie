export const dayjs = require("dayjs");
export const relativeTime = require("dayjs/plugin/relativeTime");
export const utc = require("dayjs/plugin/utc");

const SortType = {
    DEFAULT: "default",
    DATE: "date_up",
    RATE: "rate-up",
};

const ExtraTitle = {
    RATED: "Top rated",
    COMMENTED: "Most commented",
};

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

    for(let i = 0; i <= randArrayLength; i++) {
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

/*export const updateItem = (items, update) => {
    const index = items.findIndex((item) => item.id === update.id);

    if (index === -1) {
        return items;
    }

    return [
        ...items.slice(0, index),
        update,
        ...items.slice(index + 1),
    ];
};*/

export default class Observer {
    constructor() {
        this._observers = [];
    }
  
    addObserver(observer) {
        this._observers.push(observer);
    }
  
    removeObserver(observer) {
        this._observers = this._observers.filter((existedObserver) => existedObserver !== observer);
    }
  
    _notify(event, payload) {
        this._observers.forEach((observer) => observer(event, payload));
    }
}




export {SortType, ExtraTitle, getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray, getTimeFormat};

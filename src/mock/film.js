import {getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray} from "./util.js";

const filmTitles = [
    "The Dance of Life", "Sagebrush Trail","The Man with the Golden Arm",
    "Santa Claus Conquers the Martians", "Popeye the Sailor Meets Sindbad the Sailor"
];

const filmPosters = [
    "./images/posters/made-for-each-other.png",
    "./images/posters/popeye-meets-sinbad.png",
    "./images/posters/sagebrush-trail.jpg",
    "./images/posters/santa-claus-conquers-the-martians.jpg",
    "./images/posters/the-dance-of-life.jpg",
    "./images/posters/the-great-flamarion.jpg",
    "./images/posters/the-man-with-the-golden-arm.jpg"
];

const filmDescriptions = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
    "Cras aliquet varius magna, non porta ligula feugiat eget.",
    "Fusce tristique felis at fermentum pharetra.", 
    "Aliquam id orci ut lectus varius viverra." ,
    "Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.", 
    "Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.",
    "Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.",
    "Sed sed nisi sed augue convallis suscipit in sed felis.","Aliquam erat volutpat.",
    "Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus."
];

const filmGenres = ["Musical", "Comedy", "Drama", "Documental", "Historical"];

const filmDuration = ["1h 3min", "2h 33min", "1h 00min", "2h 5min", "1h 10min"];

const directors = ["Anthony Mann", "Guy Ritchie", "David Yates", "Ridley Scott", "Alfred Hitchcock",]; 
const writers = ["Anne Wigton", "Heinz Herald", "Richard Weil", "Russell Tee", "Noel Adams", "Clemence Dane"];
const actors = ["Robert De Niro", "Jack Nicholson", "Marlon Brando", "Denzel Washington", " Katharine Hepburn"];
const releases = ["01 April 1945", "30 March 1945", "30 May 1925", "05 October 2000"];
const countryes = ["USA","Great Britain", "Russia"];

const generateFilm = () => {
    return {
        poster: getRandomArrayElement(filmPosters),
        title: getRandomArrayElement(filmTitles),
        rate: getRandomNumber(0, 10),
        year: getRandomCeilNumber(1921, 2005),
        duration: getRandomArrayElement(filmDuration),
        genre: getRandomArrayElement(filmGenres),
        description: getRandomArray(filmDescriptions, 0, 5),
        comments: getRandomCeilNumber(0, 5),
    };
};

const generatePopupFilm = () => {
    return {
        poster: getRandomArrayElement(filmPosters),
        title: getRandomArrayElement(filmTitles),
        originalTitle: getRandomArrayElement(filmTitles),
        director: getRandomArrayElement(directors),
        writers: getRandomArray(writers, 0, 3),
        actors: getRandomArray(actors, 0, 5),
        release: getRandomArrayElement(releases),
        rate: getRandomNumber(0, 10),
        ageRate: `${getRandomCeilNumber(0, 18)}+`,
        duration: getRandomArrayElement(filmDuration),
        country: getRandomArrayElement(countryes),
        genre: getRandomArrayElement(filmGenres),//если жанров несколько выводить geners
        description: getRandomArray(filmDescriptions, 0, 5),
        /*comments: getRandomCeilNumber(0, 5), завести отдельную структуру*/
    };
};

export {generateFilm, generatePopupFilm};
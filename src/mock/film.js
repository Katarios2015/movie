import {getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray, getTimeFormat} from "../utils/common.js";
import {nanoid} from "nanoid";
import {dayjs} from "../utils/common.js";
import {relativeTime} from "../utils/common.js";
import {utc} from "../utils/common.js";

const MAX_COMMENTS_COUNT = 5;

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

const filmDurations = [56, 120, 77, 140, 180];

const commentIds = [5, 120, 7, 140, 1];

const directors = ["Anthony Mann", "Guy Ritchie", "David Yates", "Ridley Scott", "Alfred Hitchcock"];
const writers = ["Anne Wigton", "Heinz Herald", "Richard Weil", "Russell Tee", "Noel Adams", "Clemence Dane"];
const actors = ["Robert De Niro", "Jack Nicholson", "Marlon Brando", "Denzel Washington", "Katharine Hepburn"];
const releases = ["2019-05-11T00:00:00.000Z", "2019-05-11T00:00:00.000Z", "2019-05-11T00:00:00.000Z", "2019-05-11T00:00:00.000Z"];
const countryes = ["USA","Great Britain", "Russia"];

const commentAthors = ["Ivan Pypkov", "Kate Ritchie", "David", "Roman Scott", "Alfred"];
const commentDates = ["2019-05-11T16:12:32.554Z", "2020-10-11T16:12:32.554Z", "2009-11-11T16:12:32.554Z", "2023-01-11T16:12:32.554Z"];

const commentEmotions = [
    "./images/emoji/angry.png",
    "./images/emoji/puke.png",
    "./images/emoji/sleeping.png",
    "./images/emoji/smile.png"
];

dayjs.extend(utc);
dayjs.extend(relativeTime);
//const dateCommentFormat = dayjs(getRandomArrayElement(commentDates)).format("YYYY/MM/DD  hh:mm:ss");

const generatePopupComment = () => {
    const commentInFormatDates = commentDates.map((el)=> dayjs.utc(el).format("YYYY/MM/DD  HH:mm:ss"));
    return {
        id: getRandomArrayElement(commentIds).toString(),
        author: getRandomArrayElement(commentAthors),
        commentText: getRandomArray(filmDescriptions, 0, 5),
        //date: dayjs(getRandomArrayElement(commentDates)).format("YYYY/MM/DD  hh:mm"),//по общему тз
        date: dayjs(getRandomArrayElement(commentInFormatDates)).fromNow(),//по доп заданию в тз
        emotion: getRandomArrayElement(commentEmotions),
    };
};


const popupComments = new Array(MAX_COMMENTS_COUNT).fill().map(generatePopupComment);


const getCommentsId = () => {
    const newPopupComments = popupComments.slice();
    newPopupComments.length = getRandomCeilNumber(0, MAX_COMMENTS_COUNT);
    return newPopupComments.map((comment) => comment.id);

};


const generateFilm = () => {
    //const idOfComments = getRandomArrayElement(commentIds);
    return {
        id: nanoid(),
        poster: getRandomArrayElement(filmPosters),
        title: getRandomArrayElement(filmTitles),
        rate: getRandomNumber(0, 10),
        year: getRandomCeilNumber(1921, 2005),
        duration: getTimeFormat(getRandomArrayElement(filmDurations)),
        genres:  getRandomArray(filmGenres, 0, 3),
        description: getRandomArray(filmDescriptions, 0, 5),
        comments: getCommentsId(),
        
        isWatchList: Boolean(getRandomCeilNumber(0, 1)),
        isWatched: Boolean(getRandomCeilNumber(0, 1)),
        isFavorite: Boolean(getRandomCeilNumber(0, 1)),

        originalTitle: getRandomArrayElement(filmTitles),
        director: getRandomArrayElement(directors),
        writers: getRandomArray(writers, 0, 3),
        actors: getRandomArray(actors, 0, 5),
        release: dayjs(getRandomArrayElement(releases)).format("DD MMMM YYYY"),
        ageRate: `${getRandomCeilNumber(0, 18)}+`,
        country: getRandomArrayElement(countryes),
    };
};



export {generateFilm, popupComments};

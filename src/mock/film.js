import {getRandomArrayElement, getRandomCeilNumber, getRandomNumber, getRandomArray} from "../utils/common.js";
import {nanoid} from "nanoid";
import {dayjs} from "../utils/common.js";
import {relativeTime} from "../utils/common.js";
import {utc} from "../utils/common.js";
dayjs.extend(utc);
dayjs.extend(relativeTime);
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

const filmGenres = ["Sci-Fi", "Animation", "Fantasy", "Comedy", "TV Series"];

const filmDurations = [56, 120, 77, 140, 180];

const commentIds = [5, 120, 7, 140, 1];

const directors = ["Anthony Mann", "Guy Ritchie", "David Yates", "Ridley Scott", "Alfred Hitchcock"];
const writers = ["Anne Wigton", "Heinz Herald", "Richard Weil", "Russell Tee", "Noel Adams", "Clemence Dane"];
const actors = ["Robert De Niro", "Jack Nicholson", "Marlon Brando", "Denzel Washington", "Katharine Hepburn"];
const releases = ["2009-05-11T00:00:00.000Z", "2010-05-11T00:00:00.000Z", "2000-05-11T00:00:00.000Z", "2019-05-11T00:00:00.000Z"];
const countryes = ["USA","Great Britain", "Russia"];

const commentAthors = ["Ivan Pypkov", "Kate Ritchie", "David", "Roman Scott", "Alfred"];
const commentDates = ["2019-05-11T16:12:32.554Z", "2020-10-11T16:12:32.554Z", "2009-11-11T16:12:32.554Z", "2023-01-11T16:12:32.554Z"];
const watchingDates = ["2023-06-26T12:58:32.554Z", "2023-06-26T12:58:32.554Z", "2022-06-26T12:12:32.554Z", "2021-06-26T12:12:32.554Z"];
const watchingInFormatDates = watchingDates.map((el)=> dayjs.utc(el).toDate());

const commentEmotions = [
    "./images/emoji/angry.png",
    "./images/emoji/puke.png",
    "./images/emoji/sleeping.png",
    "./images/emoji/smile.png"
];

//const dateCommentFormat = dayjs(getRandomArrayElement(commentDates)).format("YYYY/MM/DD  hh:mm:ss");

const generatePopupComment = () => {
    const commentInFormatDates = commentDates.map((el)=> dayjs.utc(el).format("YYYY/MM/DD  HH:mm:ss"));
    return {
        id: getRandomArrayElement(commentIds).toString(),
        author: getRandomArrayElement(commentAthors),
        comment: getRandomArray(filmDescriptions, 0, 5),
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
        comments: getCommentsId(),
        filmInfo: {
            title: getRandomArrayElement(filmTitles),
            alternativeTitle: getRandomArrayElement(filmTitles),//originalTitle
            totalRating : getRandomNumber(0, 10),//rate
            poster: getRandomArrayElement(filmPosters),
            ageRating: `${getRandomCeilNumber(0, 18)}+`,//ageRate
            director: getRandomArrayElement(directors),
            writers: getRandomArray(writers, 0, 3),
            actors: getRandomArray(actors, 0, 5),
            release: {
                date: getRandomArrayElement(releases),//release dayjs(getRandomArrayElement(releases)).format("DD MMMM YYYY")
                //year: getRandomCeilNumber(1921, 2005),брать год в карточку фильма из даты релиза
                releaseCountry: getRandomArrayElement(countryes),//country
            },
            runtime: getRandomArrayElement(filmDurations),//duration
            genre:  getRandomArray(filmGenres, 0, 3),//genres
            description: getRandomArray(filmDescriptions, 0, 5),
        },
        userDetails: {
            watchlist: Boolean(getRandomCeilNumber(0, 1)),//isWatchList
            alreadyWatched: Boolean(getRandomCeilNumber(0, 1)),//isWatched
            watchingDate:getRandomArrayElement(watchingInFormatDates),//watchingDate
            favorite: Boolean(getRandomCeilNumber(0, 1)),//isFavorite
        }   
    };
};



export {generateFilm, popupComments};

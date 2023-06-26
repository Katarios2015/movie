import {siteFilterMap} from "./filter.js";
import {FilterType, InputType, TIME_PERIOD} from "./constants.js";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
var isToday = require('dayjs/plugin/isToday');
dayjs.extend(isBetween);
dayjs.extend(isToday);

export const getSortedGenreObject = (whatchedArray) => {
    
    let watchedGenres = [];
    let genresObj = {};
    whatchedArray.forEach((item) => {
        watchedGenres = watchedGenres.concat(item.genres).sort();
          
        for (let i = 0; i < watchedGenres.length; i++) {
            const item = watchedGenres[i];
            if (genresObj[item]){
                genresObj[item] +=1;
            }
                
            else {
                genresObj[item] = 1;
            }    
        }
       
    });
    return genresObj;
};

export const getTopGenre = (genreObj) => {
    if(genreObj===0){
        return "";
    }
    let topGenre = "";
    let swap = 0;

    for(const genre in genreObj) {
        if (genreObj[genre] > swap){
            swap = genreObj[genre];
            topGenre = genre;
        }                
    }     
    
    return topGenre;
};


export const getDurationTotal = (whatchedArray) => {
    let total = 0;
    whatchedArray.map((item) =>  {
        total+=item.duration;
    });
    return total; 
};

export const getWatchedArray = (data) => {
    const WatchedArray = data.filter((film) => film.isWatched);
    return WatchedArray;
};

const today = new Date();
console.log("today " + today);
const lastWeekDate = dayjs(today).subtract(TIME_PERIOD.WEEK, "day").toDate();
console.log("lastWeekDate " + lastWeekDate);
const lastMonthDate = dayjs(today).subtract(TIME_PERIOD.MONTH, "month").toDate();
console.log("lastMonthDate " + lastMonthDate);
const lastYearDate = dayjs(today).subtract(TIME_PERIOD.YEAR, "year").toDate();
console.log("lastYearDate " + lastYearDate);


export const siteInputMap = {
    [InputType.ALL_TIME]: (mockFilms) => mockFilms.filter((film) => film.isWatched),
    [InputType.TODAY]: (mockFilms) => mockFilms.filter((film) => 
        film.isWatched && dayjs(film.watchingDate).isToday()),
    [InputType.WEEK]:  (mockFilms) => mockFilms.filter((film) => 
        film.isWatched && dayjs(film.watchingDate)
            .isBetween(today, dayjs(lastWeekDate), "day", "[]")),
    [InputType.MONTH]:  (mockFilms) => mockFilms.filter((film) => 
        film.isWatched && dayjs(film.watchingDate)
            .isBetween(today, dayjs(lastMonthDate), "month", "[]")),
    [InputType.YEAR]:  (mockFilms) => mockFilms.filter((film) => 
        film.isWatched && dayjs(film.watchingDate)
            .isBetween(today, dayjs(lastYearDate), "year", "[]")),
};

//let count = {};

/* const reduseTest = watchedGenres.forEach((item)=> {
            if (count[item]){
                count[item] +=1;
            } else {
                count[item] = 1;
            }

            console.log(count);
    });*/
   
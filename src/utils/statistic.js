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
        watchedGenres = watchedGenres.concat(item.filmInfo.genre).sort();
        watchedGenres.forEach((item)=>{
            if (genresObj[item]){
                genresObj[item] +=1;
            }
            else {
                genresObj[item] = 1;
            }    
        });
    });
    return genresObj;
};

export const getTopGenre = (genreObj) => {
    if(genreObj===0){
        return "";
    }
    let topGenre = "";
    let swap = 0;
    for(const genreItem in genreObj) {
        if (genreObj[genreItem] > swap){
            swap = genreObj[genreItem];
            topGenre = genreItem;
        }                
    } 
    return topGenre;
};


export const getDurationTotal = (whatchedArray) => {
    let total = 0;
    whatchedArray.map((item) =>  {
        total+=item.filmInfo.runtime;
    });
    return total; 
};

export const getWatchedArray = (data) => {
    const WatchedArray = data.filter((film) => film.userDetails.alreadyWatched);
    return WatchedArray;
};

const today = new Date();
const lastWeekDate = dayjs(today).subtract(TIME_PERIOD.WEEK, "day").toDate();
const lastMonthDate = dayjs(today).subtract(TIME_PERIOD.MONTH, "month").toDate();
const lastYearDate = dayjs(today).subtract(TIME_PERIOD.YEAR, "year").toDate();


export const siteInputMap = {
    [InputType.ALL_TIME]: (mockFilms) => mockFilms.filter((film) => film.userDetails.alreadyWatched),
    [InputType.TODAY]: (mockFilms) => mockFilms.filter((film) => 
        film.alreadyWatched && dayjs(film.watchingDate).isToday()),
    [InputType.WEEK]:  (mockFilms) => mockFilms.filter((film) => 
        film.alreadyWatched && dayjs(film.watchingDate)
            .isBetween(today, dayjs(lastWeekDate), "day", "[]")),
    [InputType.MONTH]:  (mockFilms) => mockFilms.filter((film) => 
        film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate)
            .isBetween(today, dayjs(lastMonthDate), "month", "[]")),
    [InputType.YEAR]:  (mockFilms) => mockFilms.filter((film) => 
        film.userDetails.alreadyWatched && dayjs(film.userDetails.watchingDate)
            .isBetween(today, dayjs(lastYearDate), "year", "[]")),
};
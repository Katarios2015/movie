import {FilterType} from "./constants.js" ;

export const siteFilterMap = {
    [FilterType.ALL]: (movies) => movies.slice(),
    [FilterType.WATCHLIST]: (movies) => movies.filter((film) => film.userDetails.watchlist),
    [FilterType.HISTORY]:  (movies) => movies.filter((film) => film.userDetails.alreadyWatched),
    [FilterType.FAVORITES]:  (movies) => movies.filter((film) => film.userDetails.favorite),
};

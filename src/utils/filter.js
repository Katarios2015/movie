import {FilterType} from "./constants.js" ;

export const siteFilterMap = {
    [FilterType.ALL]: (mockFilms) => mockFilms,
    [FilterType.WATCHLIST]: (mockFilms) => mockFilms.filter((film) => film.userDetails.watchlist),
    [FilterType.HISTORY]:  (mockFilms) => mockFilms.filter((film) => film.userDetails.alreadyWatched),
    [FilterType.FAVORITES]:  (mockFilms) => mockFilms.filter((film) => film.userDetails.favorite),
};

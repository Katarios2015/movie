import {FilterType} from "./constants.js" ;

export const siteFilterMap = {
    [FilterType.ALL]: (mockFilms) => mockFilms,
    [FilterType.WATCHLIST]: (mockFilms) => mockFilms.filter((film) => film.isWatchList),
    [FilterType.HISTORY]:  (mockFilms) => mockFilms.filter((film) => film.isWatched),
    [FilterType.FAVORITES]:  (mockFilms) => mockFilms.filter((film) => film.isFavorite),
};

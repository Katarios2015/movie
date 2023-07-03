import {FilterType} from "./constants.js" ;

export const siteFilterMap = {
    [FilterType.ALL]: (mockFilms) => mockFilms,
    [FilterType.WATCHLIST]: (mockFilms) => mockFilms.filter((film) => film.user_details.watchlist),
    [FilterType.HISTORY]:  (mockFilms) => mockFilms.filter((film) => film.user_details.already_watched),
    [FilterType.FAVORITES]:  (mockFilms) => mockFilms.filter((film) => film.user_details.favorite),
};

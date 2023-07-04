const siteFilterMap = {
    all: (mockFilms) => mockFilms.length,
    watchlist: (mockFilms) => mockFilms.filter((film) => film.user_details.watchlist).length,
    history:  (mockFilms) => mockFilms.filter((film) => film.user_details.already_watched).length,
    favorites:  (mockFilms) => mockFilms.filter((film) => film.user_details.favorite).length,
};

const generateFilter = (mockFilms) => {
    return Object.entries(siteFilterMap).map(([filterName, filmsCount]) => {
        return {
            name: filterName,
            count: filmsCount(mockFilms)
        };
    });
};

export {generateFilter};
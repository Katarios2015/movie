const siteFilterMap = {
    all: (mockFilms) => mockFilms.length,
    watchlist: (mockFilms) => mockFilms.filter((film) => film.userDetails.watchlist).length,
    history:  (mockFilms) => mockFilms.filter((film) => film.userDetails.alreadyWatched).length,
    favorites:  (mockFilms) => mockFilms.filter((film) => film.userDetails.favorite).length,
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
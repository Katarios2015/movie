const siteFilterMap = {
    all: (mockFilms) => mockFilms.length,
    watchlist: (mockFilms) => mockFilms.filter((film) => film.isWatchList).length,
    history:  (mockFilms) => mockFilms.filter((film) => film.isWatched).length,
    favorites:  (mockFilms) => mockFilms.filter((film) => film.isFavorite).length,
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
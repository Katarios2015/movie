
import Observer from "../utils/common.js" ;

export default class Movies extends Observer {
    constructor () {
        super();
        this._movies = [];
    }

    setMovies (UpdateType, movies) {
        this._movies = movies.slice();
        this._notify(UpdateType);
    }

    getMovies () {
        return this._movies;
    }
    
    updateMovie (updateType, update) {
        const index =  this._movies.findIndex((item) => item.id === update.id);
    
        if (index === -1) {
            throw new Error("Can't delete unexisting movies");
        }
    
        this._movies = [
            ...this._movies.slice(0, index),
            update,
            ...this._movies.slice(index + 1),
        ];

        this._notify(updateType, update);
    }

    static adaptToClient(movie) {
        const adaptedMovie = Object.assign(
            {},
            movie,
            {
                id: movie.id,
                comments: movie.comments,
                filmInfo: {
                    title: movie.film_info.title,
                    alternativeTitle: movie.film_info.alternative_title,
                    totalRating : movie.film_info.total_rating,
                    poster: movie.film_info.poster,
                    ageRating: movie.film_info.age_rating,
                    director: movie.film_info.director,
                    writers: movie.film_info.writers,
                    actors: movie.film_info.actors,
                    release: {
                        date: new Date(movie.film_info.release.date),
                        releaseCountry:  movie.film_info.release.release_country,
                    },
                    runtime: movie.film_info.runtime,
                    genre: movie.film_info.genre,
                    description: movie.film_info.description,
                },
                userDetails: {
                    watchlist: movie.user_details.watchlist,
                    alreadyWatched: movie.user_details.already_watched,
                    watchingDate: movie.user_details.watching_date !== null ?
                        new Date (movie.user_details.watching_date): movie.user_details.watching_date,
                    favorite: movie.user_details.favorite
                }
            },
        );
        delete adaptedMovie.film_info;
        //delete adaptedMovie.film_info.alternative_title;
        //delete adaptedMovie.film_info.total_rating;
        //delete adaptedMovie.film_info.age_rating;
        //delete adaptedMovie.film_info.release.release_country;
        delete adaptedMovie.user_details;
        //delete adaptedMovie.user_details.already_watched;

        return adaptedMovie;
    }

    static adaptToServer(movie) {
        const adaptedMovie = Object.assign(
            {},
            movie,
            {
                "id": movie.id,
                "comments": movie.comments,
                "film_info": {
                    "title": movie.filmInfo.title,
                    "alternative_title": movie.filmInfo.alternativeTitle,
                    "total_rating": movie.filmInfo.totalRating,
                    "poster": movie.filmInfo.poster,
                    "age_rating": movie.filmInfo.ageRating,
                    "director":movie.filmInfo.director,
                    "writers":movie.filmInfo.writers,
                    "actors": movie.filmInfo.actors,
                    "release": {
                        "date": movie.filmInfo.release.date.toISOString(),
                        "release_country": movie.filmInfo.release.releaseCountry
                    },
                    "runtime": movie.filmInfo.runtime,
                    "genre": movie.filmInfo.genre,
                    "description": movie.filmInfo.description,
                },
                "user_details": {
                    "watchlist": movie.userDetails.watchlist,
                    "already_watched": movie.userDetails.alreadyWatched,
                    "watching_date": movie.userDetails.watchingDate instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
                    "favorite": movie.userDetails.favorite
                }
            },
        );
    
        // Ненужные ключи мы удаляем
        delete adaptedMovie.filmInfo;
        delete adaptedMovie.userDetails;
        //delete adaptedMovie.userDetails.alreadyWatched;
        //delete adaptedMovie.userDetails.favorite;
        //delete adaptedMovie.userDetails.watchlist;

        return adaptedMovie;
    }
}
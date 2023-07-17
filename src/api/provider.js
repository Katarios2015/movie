import MoviesModel from "../model/movies.js";
import CommentsModel from "../model/comments.js";
import {isOnline} from "../utils/common.js";

const getSyncedMovies = (items) => {
    return items.filter(({success}) => success)
        .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
    return items.reduce((acc, current) => {
        return Object.assign({}, acc, {
            [current.id]: current,
        });
    }, {});
};

export default class Provider {

    constructor(api, store) {
        this._api = api;
        this._store = store;
    }

    getMovies() {
        if (isOnline()) {
            return this._api.getMovies()
                .then((movies) => {
                    const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
                    this._store.setItems(items);
                    return movies;
                });
        }
        const storeMovies = Object.values(this._store.getItems());
        return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
    }
    
    updateMovie(movie) {      
        if (isOnline()) {
            return this._api.updateMovie(movie)
                .then((updatedMovie) => {
                    this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
                    return updatedMovie;
                });
        }
      
        this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));
        return Promise.resolve(movie);
    }

    getComments(movieId) {
        if (isOnline()) {
            return this._api.getComments(movieId);
        }
        return Promise.resolve([]);
    }

    addComment(comment, movieId) {
        if (isOnline()) {
            return this._api.addComment(comment, movieId);
        }
        return Promise.reject(new Error("Can't add comment offline"));
    }

    deleteComment(comment) {
        if (isOnline()) {
            return this._api.deleteComment(comment);
        }
        return Promise.reject(new Error("Can't delete comment offline"));
    }

    sync() {
        if (isOnline()) {
            const storeMovies = Object.values(this._store.getItems());
            return this._api.sync(storeMovies)
                .then((response) => {
                    // Забираем из ответа синхронизированные 
                    const createdMovies = getSyncedMovies(response.created);
                    const updatedMovies = getSyncedMovies(response.updated);
                    // Добавляем синхронизированные фильмы в хранилище.
                    // Хранилище должно быть актуальным в любой момент.
                    const items = createStoreStructure([...createdMovies, ...updatedMovies]);
                    this._store.setItems(items);
                });
        }
        return Promise.reject(new Error("Sync data failed"));
    }
}
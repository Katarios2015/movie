import AbstractView from "./abstract.js";
import {getTimeFormat} from "../utils/common.js";
import {dayjs} from "../utils/common.js";

const createFilmsControls = (film) => {
    const {user_details:{watchlist, already_watched, favorite}} = film;

    const watchListClass = watchlist
        ? "film-card__controls-item--add-to-watchlist film-card__controls-item--active" :
        "film-card__controls-item--add-to-watchlist";
    const watchedClass = already_watched
        ? "film-card__controls-item--mark-as-watched film-card__controls-item--active" :
        "film-card__controls-item--mark-as-watched";
    const favoriteClass = favorite
        ? "film-card__controls-item--favorite film-card__controls-item--active" :
        "film-card__controls-item--favorite";

    return (`<button class="film-card__controls-item ${watchListClass}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item ${watchedClass}" type="button">Mark as watched</button>
    <button class="film-card__controls-item ${favoriteClass}" type="button">Mark as favorite</button>`
    );
    
};

const createFilmCardTemplate = (film) => {
    const {
        film_info:
        {poster, title, total_rating, 
            release:{date}, 
            runtime, genre, description}, comments} = film;
    const genres = genre.slice(0, 1);
    const newFormatDuration = getTimeFormat(runtime);

    return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(date).format("YYYY")}</span>
      <span class="film-card__duration">${newFormatDuration}</span>
      <span class="film-card__genre">${genres}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length}</a>
    <div class="film-card__controls">
    ${createFilmsControls(film)}
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView{
    constructor (film) {
        super();
        this._film = film;

        this._filmCardMove = this._filmCardMove.bind(this);

        this._filmPosterClickHandler = this._filmPosterClickHandler.bind(this);
        this._filmTitleClickHandler = this._filmTitleClickHandler.bind(this);
        this._filmCommentsClickHandler = this._filmCommentsClickHandler.bind(this);

        this._addToWhatchListClickHandler = this._addToWhatchListClickHandler.bind(this);
        this._addToAlreadyWatchedHandler = this._addToAlreadyWatchedHandler.bind(this);
        this._addToFavoriteClickHandler = this._addToFavoriteClickHandler.bind(this);
    }

    getTemplate() {
        return createFilmCardTemplate(this._film);
    }

    _filmPosterClickHandler(evt) {
        evt.preventDefault();
        this._callback.clickPoster();
    }

    _filmTitleClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickTitle();
    }

    _filmCommentsClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickComment();
    }

    _filmCardMove(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.move();
    }

    _addToWhatchListClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickItemWatchList();
    }

    _addToAlreadyWatchedHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickItemToAlready();
    }

    _addToFavoriteClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickItemToFavorite();
    }

    setPosterClickHandler (callback) {
        this._callback.clickPoster = callback;
        this.getElement().querySelector(".film-card__poster")
            .addEventListener("click", this._filmPosterClickHandler);
    }

    setTitleMoveHandler (callback) {
        this._callback.move = callback;
        this.getElement().querySelector(".film-card__title")
            .addEventListener("mousemove", this._filmCardMove);
    }

    setTitleClickHandler (callback) {
        this._callback.clickTitle = callback;
        this.getElement().querySelector(".film-card__title")
            .addEventListener("click", this._filmTitleClickHandler);
    }

    setCommentsClickHandler (callback) {
        this._callback.clickComment = callback;
        this.getElement().querySelector(".film-card__comments")
            .addEventListener("click", this._filmCommentsClickHandler);
    }

    setAddToWatchListClickHandler (callback) {
        this._callback.clickItemWatchList = callback;
        this.getElement().querySelector(".film-card__controls-item--add-to-watchlist")
            .addEventListener("click", this._addToWhatchListClickHandler);
    }

    setAlreadyWatchedClickHandler (callback) {
        this._callback.clickItemToAlready = callback;
        this.getElement().querySelector(".film-card__controls-item--mark-as-watched")
            .addEventListener("click", this._addToAlreadyWatchedHandler);
    }

    setAddToFavoriteClickHandler (callback) {
        this._callback.clickItemToFavorite = callback;
        this.getElement().querySelector(".film-card__controls-item--favorite")
            .addEventListener("click", this._addToFavoriteClickHandler);
    }
}




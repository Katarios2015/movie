
import {createElement} from "../render.js";

const createFilmsControls = (film) => {
    const {isWatchList, isWatched, isFavorite} = film;

    const watchListClass = isWatchList 
        ? "film-card__controls-item--add-to-watchlist film-card__controls-item--active" : 
        "film-card__controls-item--add-to-watchlist";
    const watchedClass = isWatched 
        ? "film-card__controls-item--mark-as-watched film-card__controls-item--active" : 
        "film-card__controls-item--mark-as-watched";
    const favoriteClass = isFavorite 
        ? "film-card__controls-item--favorite film-card__controls-item--active" : 
        "film-card__controls-item--favorite";
  
    return (`<button class="film-card__controls-item ${watchListClass}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item ${watchedClass}" type="button">Mark as watched</button>
    <button class="film-card__controls-item ${favoriteClass}" type="button">Mark as favorite</button>`
    );

};



const createFilmCardTemplate = (film) => {
    const {poster, title, rate, year, duration, genres, description, comments} = film;
    const genre = genres.slice(0, 1);

    return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rate}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments.length}</a>
    <div class="film-card__controls">
    ${createFilmsControls(film)}
    </div>
  </article>`;
};

export default class FilmCard {
    constructor (film) {
        this._film = film;
        this._element = null;
    }

    getTemplate() {
        return createFilmCardTemplate(this._film);
    }

    getElement() {
        if(!this._element) {
            this._element = createElement (this.getTemplate());
        }
        return this._element;
    }

    removeElement() {
        this._element = null;
    }
}




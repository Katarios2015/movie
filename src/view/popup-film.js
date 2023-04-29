import AbstractView from "./abstract.js";


const createGenreTemplate = (popupFilm) => {
    const {genres} = popupFilm;
    let genreEnding = "";

    if (genres.length > 1) {
        genreEnding = "Genres";
    } else {
        genreEnding = "Genre";
    }
    return(
        `<td class="film-details__term">${genreEnding}</td>
    <td class="film-details__cell">
      ${genres.map((el) => `<span class="film-details__genre">${el}</span>`).join("")} 
    </td>`
    );
    
}; 

const createPopupControls = (popupFilm) => {

    const {isWatchList, isWatched, isFavorite} = popupFilm;

    const watchListClass = isWatchList 
        ? "film-details__control-button--watchlist film-details__control-button--active" : 
        "film-details__control-button--watchlist";
    const watchedClass = isWatched 
        ? "film-details__control-button--watched film-details__control-button--active" : 
        "film-details__control-button--watched";
    const favoriteClass = isFavorite 
        ? "film-details__control-button--favorite film-details__control-button--active" : 
        "film-details__control-button--favorite";
    
    return (`<button type="button" class="film-details__control-button ${watchListClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${watchedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>`
    );

};

const createCommentTemplate = (comments) => {
    return (`${comments.map(({author, commentText, date, emotion}) => `<li class="film-details__comment">
<span class="film-details__comment-emoji">
  <img src="${emotion}" width="55" height="55" alt="emoji-smile">
</span>
<div>
  <p class="film-details__comment-text">${commentText}</p>
  <p class="film-details__comment-info">
    <span class="film-details__comment-author">${author}</span>
    <span class="film-details__comment-day">${date}</span>
    <button class="film-details__comment-delete">Delete</button>
  </p>
</div>
</li>`).join("")}`);
};


const createPopupTemplate = (popupFilm) => {
    const {poster, title, originalTitle, 
        director, writers, actors,
        rate, ageRate, release, 
        duration, country, description, comments} = popupFilm;
    
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${poster} alt="">
  
            <p class="film-details__age">${ageRate}</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${originalTitle}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rate}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.map((el)=>el).join(", ")}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.map((el)=>el).join(", ")}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${release}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                ${createGenreTemplate(popupFilm)}
              </tr>
            </table>
  
            <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>
  
        <section class="film-details__controls">
        ${createPopupControls(popupFilm)}
        </section>
      </div>
  
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
  
          <ul class="film-details__comments-list">
           ${createCommentTemplate(comments)}
          </ul>
  
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends AbstractView {
    constructor (popupFilm) {
        super();
        this._popupFilm = popupFilm;

        this._exitBtnClickHandler = this._exitBtnClickHandler.bind(this);
    }

    getTemplate() {
        return createPopupTemplate(this._popupFilm);
    }

    _exitBtnClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickExit();
    }

    setExitBtnClickHandler (callback) {
        this._callback.clickExit = callback;
        this.getElement().querySelector(".film-details__close-btn").addEventListener("click", this._exitBtnClickHandler);
    }
}
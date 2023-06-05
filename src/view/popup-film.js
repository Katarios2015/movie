import SmartView from "./smart.js";


const createGenreTemplate = (data) => {
    const {genres} = data;
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

const createPopupControls = (data) => {

    const {isWatchList, isWatched, isFavorite} = data;

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

const Emoji = {
    SMILE: "smile",
    SLEEPING: "sleeping",
    PUKE: "puke",
    ANGRY: "angry"
};


const createNewCommentTemplate = (isChecked, imgSrc) => {
    const emojiValues = Object.values(Emoji);
 
    const emojiImg = isChecked ?
        `<img src="images/emoji/${imgSrc}.png" width="55" height="55" alt="emoji-smile">` : "";

    return (`<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${emojiImg}</div>
  
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>
  
    <div class="film-details__emoji-list">
      ${emojiValues.map((emotion) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="${emotion}">
      </label>`).join("")}
    </div>
  </div>`);
};

const createPopupTemplate = (data) => {
    const {poster, title, originalTitle,
        director, writers, actors,
        rate, ageRate, release,
        duration, country, description, comments, isChecked, imgSrc} = data;

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
                ${createGenreTemplate(data)}
              </tr>
            </table>

            <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
        ${createPopupControls(data)}
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
           ${createCommentTemplate(comments)}
          </ul>
          ${createNewCommentTemplate(isChecked, imgSrc)}
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
    constructor (popupFilm) {
        super();
        this._data = this._parseFilmToData(popupFilm);

        this._exitBtnClickHandler = this._exitBtnClickHandler.bind(this);

        this._addToWhatchListBtnClickHandler = this._addToWhatchListBtnClickHandler.bind(this);
        this._addToAlreadyWatchedBtnHandler = this._addToAlreadyWatchedBtnHandler.bind(this);
        this._addToFavoriteBtnClickHandler = this._addToFavoriteBtnClickHandler.bind(this);
        
        this._deleteClickHandler = this._deleteClickHandler.bind(this);

        this._parseFilmToData = this._parseFilmToData.bind(this);
        this._addEmojiHandler = this._addEmojiHandler.bind(this);

        //this._parseDataToFilm = this._parseDataToFilm.bind(this);
        this._setInnerHandlers();

    }

    _parseFilmToData(popupFilm) {
        return Object.assign(
            {},
            popupFilm,
            {
                isChecked: "",
                imgSrc: "",
            }
        );
    }

    /*_parseDataToFilm(data) {
        data = Object.assign(
            {},
            data
        );
        return data;
    }*/


    reset(popupFilm) {
        this.updateData(
            this._parseFilmToData(popupFilm)
        );
    }

    getTemplate() {
        return createPopupTemplate(this._data);
    }

    _exitBtnClickHandler(evt) {
        evt.preventDefault();
        // 3. А внутри абстрактного обработчика вызовем колбэк
        this._callback.clickExit();
    }

    _addToWhatchListBtnClickHandler(evt) {
        evt.preventDefault();
        this._callback.clickWatchList();
    }

    _addToAlreadyWatchedBtnHandler(evt) {
        evt.preventDefault();
        this._callback.clickToAlready();
    }

    _addToFavoriteBtnClickHandler(evt) {
        evt.preventDefault();
        this._callback.clickToFavorite();
    }


    _addEmojiHandler(evt) {
        evt.preventDefault();
        this.updateData({
            imgSrc: evt.target.value,
            isChecked: evt.target.checked,
            
        });
    }

    _deleteClickHandler(evt) {
        evt.preventDefault();
        this._data.deletedCommentId = evt.target.dataset.id;
        this._callback.deleteClick(this._data.id, this._data.deletedCommentId);
    }


    setExitBtnClickHandler (callback) {
        this._callback.clickExit = callback;
        this.getElement().querySelector(".film-details__close-btn")
            .addEventListener("click", this._exitBtnClickHandler);
    }

    setAddToWatchBtnListClickHandler (callback) {
        this._callback.clickWatchList = callback;
        this.getElement().querySelector(".film-details__control-button--watchlist")
            .addEventListener("click", this._addToWhatchListBtnClickHandler);
    }

    setAlreadyWatchedBtnClickHandler (callback) {
        this._callback.clickToAlready = callback;
        this.getElement().querySelector(".film-details__control-button--watched")
            .addEventListener("click", this._addToAlreadyWatchedBtnHandler);
    }

    setAddToFavoriteBtnClickHandler (callback) {
        this._callback.clickToFavorite = callback;
        this.getElement().querySelector(".film-details__control-button--favorite")
            .addEventListener("click", this._addToFavoriteBtnClickHandler);
    }

  
    setDeleteCommentClickHandler (callback) {
        this._callback.deleteClick = callback;
        this.getElement().querySelectorAll(".film-details__comment-delete")
            .forEach((item) => item.addEventListener("click", this._deleteClickHandler));
            
    }

    _setInnerHandlers () {
        
        this.getElement().querySelector(".film-details__emoji-list")
            .addEventListener("change", this._addEmojiHandler);
    }

    restoreHandlers () {
      
        //абстрактный метод
        //навешивает обработчики событий заново
        this._setInnerHandlers();

        this.setAddToWatchBtnListClickHandler(this._callback.clickWatchList);
        this.setAlreadyWatchedBtnClickHandler(this._callback.clickToAlready);
        this.setAddToFavoriteBtnClickHandler(this._callback.clickToFavorite);
        this.setExitBtnClickHandler(this._callback.clickExit);

        this.setDeleteCommentClickHandler(this._callback.deleteClick);
    }
}

import SmartView from "./smart.js";
import {he} from "../utils/common.js";
import {dayjs} from "../utils/common.js";
import {getTimeFormat} from "../utils/common.js";
import {EMOJI} from "../utils/constants.js";

const createGenreTemplate = (data) => {
    const {filmInfo:{genre}} = data;
    let genreEnding = "";

    if (genre.length > 1) {
        genreEnding = "Genres";
    } else {
        genreEnding = "Genre";
    }
    return(
        `<td class="film-details__term">${genreEnding}</td>
    <td class="film-details__cell">
      ${genre.map((el) => `<span class="film-details__genre">${el}</span>`).join("")}
    </td>`
    );

};

const createPopupControls = (data) => {
    const {userDetails:{watchlist, alreadyWatched, favorite}} = data;

    const watchListClass = watchlist
        ? "film-details__control-button--watchlist film-details__control-button--active" :
        "film-details__control-button--watchlist";
    const watchedClass = alreadyWatched
        ? "film-details__control-button--watched film-details__control-button--active" :
        "film-details__control-button--watched";
    const favoriteClass = favorite
        ? "film-details__control-button--favorite film-details__control-button--active" :
        "film-details__control-button--favorite";

    return (`<button type="button" class="film-details__control-button ${watchListClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${watchedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>`
    );

};


const createCommentTemplate = (data, commentsOfModel) => { 
    const includesComments = []; 
    for(const commentItem of commentsOfModel) {
        if(data.includes(commentItem.id)) {
            const {id, author, comment, date, emotion} = commentItem;
            includesComments.push(
                `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
                </span>
                <div>
                <p class="film-details__comment-text">${comment}</p>
                <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
                <button class="film-details__comment-delete" data-id="${id}">Delete</button>
                </p>
                </div>
                </li>`);
        }
    }
    
    return includesComments;
};

const createNewCommentTemplate = (isChecked, imgSrc, comment) => {
    const emojiValues = Object.values(EMOJI);
   
    const emojiImg = isChecked ?
        `<img src="images/emoji/${imgSrc}.png" width="55" height="55" alt="emoji-smile">` : "";

    return (`<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${emojiImg}</div>
  
    <label class="film-details__comment-label">
    <textarea class="film-details__comment-input"
    placeholder="Select reaction below and write comment here" name="comment">${he.encode(comment)}</textarea>
    </label>
  
    <div class="film-details__emoji-list">
      ${emojiValues.map((emotion) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="${emotion}">
      </label>`).join("")}
    </div>
  </div>`);
};

const createPopupTemplate = (data, commentsOfmodel) => {
    const {filmInfo:{poster, title, alternativeTitle,
        director, writers, actors,
        totalRating, ageRating, 
        runtime, description, release:{date, releaseCountry}},
    isChecked, imgSrc, comment} = data;
    const newFormatDuration = getTimeFormat(runtime);

    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src=${poster} alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
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
                <td class="film-details__cell">${dayjs(date).format("DD MMMM YYYY")}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${newFormatDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
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
          <h3 class="film-details__comments-title">
          Comments <span class="film-details__comments-count">${data.comments.length}</span>
          </h3>
          <ul class="film-details__comments-list">
           ${createCommentTemplate(data.comments, commentsOfmodel).join("")}
          </ul>
          ${createNewCommentTemplate(isChecked, imgSrc, comment)}
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
    constructor (popupFilm, comments) {
        super();
        this._data = this._parseFilmToData(popupFilm);
        this._comments = comments;

        this._exitBtnClickHandler = this._exitBtnClickHandler.bind(this);

        this._addToWhatchListBtnClickHandler = this._addToWhatchListBtnClickHandler.bind(this);
        this._addToAlreadyWatchedBtnHandler = this._addToAlreadyWatchedBtnHandler.bind(this);
        this._addToFavoriteBtnClickHandler = this._addToFavoriteBtnClickHandler.bind(this);
        
        this._deleteClickHandler = this._deleteClickHandler.bind(this);
        this._addCommentEnterHandler = this._addCommentEnterHandler.bind(this);

        this._parseFilmToData = this._parseFilmToData.bind(this);
        this._addEmojiHandler = this._addEmojiHandler.bind(this);
        
        this._inputCommentTextHandler = this._inputCommentTextHandler.bind(this);
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
                comment: ""
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

    update(comments) {
        this._comments = comments.slice();
        this.updateElement();
        const scrollTop = this.getElement().scrollTop;
        this.getElement().scrollTop = scrollTop;
    }

    getTemplate() {
        return createPopupTemplate(this._data, this._comments);
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

    _inputCommentTextHandler(evt) {
        evt.preventDefault();
        this.updateData({
            comment: evt.target.value,     
        }, true);
        
    }

    _deleteClickHandler(evt) {
        evt.preventDefault();
        const deletedCommentId = evt.target.dataset.id;
        this._callback.deleteClick(deletedCommentId);
    }
    
    _addCommentEnterHandler(evt) {
        if (evt.ctrlKey && evt.key === "Enter") {
            if (this._data.comment === "" || this._data.imgSrc === "") {
                return;
            }
            const newComment = {
                id: "0",
                comment: this._data.comment,
                emotion: this._data.imgSrc,
                date: new Date(),
            };
            this._callback.addCommentEnter(newComment);
        }
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

    setAddCommentClickHandler (callback) {
        this._callback.addCommentEnter = callback;
        this.getElement().querySelector("form")
            .addEventListener("keydown", this._addCommentEnterHandler);
    }

    _setInnerHandlers () { 
        this.getElement().querySelector(".film-details__emoji-list")
            .addEventListener("change", this._addEmojiHandler);
        this.getElement().querySelector(".film-details__comment-input")
            .addEventListener("input", this._inputCommentTextHandler);
    }   

    restoreHandlers () {
        //абстрактный метод
        //навешивает обработчики событий заново
        this._setInnerHandlers();

        this.setAddToWatchBtnListClickHandler(this._callback.clickWatchList);
        this.setAlreadyWatchedBtnClickHandler(this._callback.clickToAlready);
        this.setAddToFavoriteBtnClickHandler(this._callback.clickToFavorite);
        this.setExitBtnClickHandler(this._callback.clickExit);

        this.setAddCommentClickHandler(this._callback.addCommentEnter);
        this.setDeleteCommentClickHandler(this._callback.deleteClick);
    }
}

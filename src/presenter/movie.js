import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup-film.js";

import {render, RenderPosition} from "../render.js";


export default class Movie {
    constructor (siteBody) {
        
        this._siteBodyContainer = siteBody;
        

        this._filmCardComponent = null;

        this._handleShowPopupClick = this._handleShowPopupClick.bind(this);
        this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
        this._handleMove = this._handleMove.bind(this);
        this._handleExitBtnClick = this._handleExitBtnClick.bind(this);
    }

    init(filmContainer, filmData) {
        this._filmContainer = filmContainer;
        this._filmData = filmData;

        this._filmCardComponent = new FilmCardView(filmData);
        this._popupComponent = new PopupView(filmData);

        this._filmCardComponent.setPosterClickHandler(this._handleShowPopupClick);
        this._filmCardComponent.setTitleMoveHandler(this._handleMove);
        this._filmCardComponent.setTitleClickHandler(this._handleShowPopupClick);
        this._filmCardComponent.setCommentsClickHandler(this._handleShowPopupClick);

        this._popupComponent.setExitBtnClickHandler(this._handleExitBtnClick);

        render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    _onEscKeyDownHandler(evt) {
        if (evt.key === "Escape" || evt.keyCode === 27) {
            evt.preventDefault();
            this._siteBodyContainer.removeChild(this._popupComponent.getElement());
            document.removeEventListener("keydown", this._onEscKeyDownHandler);
            this._siteBodyContainer.classList.remove("hide-overflow");
        }
    }

    _handleShowPopupClick() {
        this._siteBodyContainer.appendChild(this._popupComponent.getElement());
        this._siteBodyContainer.classList.add("hide-overflow");
        document.addEventListener("keydown", this._onEscKeyDownHandler);
    }

    _handleMove() {
        this._filmCardComponent.getElement().querySelector(".film-card__title").style.cursor = "pointer";
    }

    _handleExitBtnClick() {
        this._siteBodyContainer.removeChild(this._popupComponent.getElement());
        this._siteBodyContainer.classList.remove("hide-overflow");
    }
}



/*export default class Task {
  constructor(taskListContainer) {
    this._taskListContainer = taskListContainer;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(task) {
    this._task = task;

    this._taskComponent = new TaskView(task);
    this._taskEditComponent = new TaskEditView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);
    this._taskEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    render(this._taskListContainer, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }
}*/
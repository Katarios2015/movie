import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup-film.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

//import  UserAction from "../utils/constants.js";
//import  UpdateType from "../utils/constants.js";

export const UserAction = {
    UPDATE_MOVIE: "UPDATE_MOVIE",
    ADD_COMMENT: "ADD_COMMENT",
    DELETE_COMMENT: "DELETE_COMMENT",
};
  
export const UpdateType = {
    PATCH: "PATCH",
    MINOR: "MINOR",
    MAJOR: "MAJOR",
};

const Mode = {
    DEFAULT: "DEFAULT",
    EDITING: "EDITING",
};

export default class Movie {
    constructor (siteBody, changeData, changeMode, commentsModel) {
        this._siteBodyContainer = siteBody;
        this._changeData = changeData;
        this._changeMode = changeMode;
        this._mode = Mode.DEFAULT;
        this._filmCardComponent = null;
        this._popupComponent = null;

        this._commentsModel = commentsModel;

        this._handleHidePopup = this._handleHidePopup.bind(this);

        this._handleShowPopupClick = this._handleShowPopupClick.bind(this);
        this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
        this._handleMove = this._handleMove.bind(this);
        //this._handleExitBtnClick = this._handleExitBtnClick.bind(this);

        this._handleAddToWatchedListClick = this._handleAddToWatchedListClick.bind(this);
        this._handleAddToAlreadyWatchedClick = this._handleAddToAlreadyWatchedClick.bind(this);
        this._handleAddToFavoriteClick = this._handleAddToFavoriteClick.bind(this);

        this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
        this._handleAddComment = this._handleAddComment.bind(this);
       
        this._handleModelEvent = this._handleModelEvent.bind(this);
    }

    init(filmContainer, filmData) {
        this._filmContainer = filmContainer;
        this._filmData = filmData;


        const prevFilmCardComponent = this._filmCardComponent;
        const prevPopupComponent = this._popupComponent;

        this._filmCardComponent = new FilmCardView(filmData);
        
        this._popupComponent = new PopupView(filmData, this._commentsModel.getComments());

        this._popupComponent.setExitBtnClickHandler(this._handleHidePopup);

        this._filmCardComponent.setPosterClickHandler(this._handleShowPopupClick);
        this._filmCardComponent.setTitleMoveHandler(this._handleMove);
        this._filmCardComponent.setTitleClickHandler(this._handleShowPopupClick);
        this._filmCardComponent.setCommentsClickHandler(this._handleShowPopupClick);


        this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchedListClick);
        this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAddToAlreadyWatchedClick);
        this._filmCardComponent.setAddToFavoriteClickHandler(this._handleAddToFavoriteClick);

        this._popupComponent.setAddToWatchBtnListClickHandler(this._handleAddToWatchedListClick);
        this._popupComponent.setAlreadyWatchedBtnClickHandler(this._handleAddToAlreadyWatchedClick);
        this._popupComponent.setAddToFavoriteBtnClickHandler(this._handleAddToFavoriteClick);

        this._popupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
        this._popupComponent.setAddCommentClickHandler(this._handleAddComment);

        if (prevFilmCardComponent === null || prevPopupComponent === null) {
            render(this._filmContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
            return;
        }


        if (this._mode === Mode.DEFAULT) {
            replace(this._filmCardComponent, prevFilmCardComponent);
        }

        if (this._mode === Mode.EDITING) {
            replace(this._filmCardComponent, prevFilmCardComponent);
        }

        if (this._mode === Mode.EDITING) {
            replace(this._popupComponent, prevPopupComponent);
        }

        remove(prevFilmCardComponent);
        remove(prevPopupComponent);

    }

    destroy() {
        remove(this._filmCardComponent);
        remove(this._popupComponent);
    }

    resetView() {
        if (this._mode !== Mode.DEFAULT) {
            this._handleHidePopup();
        }
    }

    _onEscKeyDownHandler(evt) {
        if (evt.key === "Escape" || evt.keyCode === 27) {
            evt.preventDefault();
            this._popupComponent.reset(this._filmData);
            this._siteBodyContainer.removeChild(this._popupComponent.getElement());
            document.removeEventListener("keydown", this._onEscKeyDownHandler);
            this._siteBodyContainer.classList.remove("hide-overflow");
            this._mode = Mode.DEFAULT;
           
        }
    }

    /*_handleExitBtnClick() {
    this._siteBodyContainer.removeChild(this._popupComponent.getElement());
    this._siteBodyContainer.classList.remove("hide-overflow");
    this._mode = Mode.DEFAULT;
  }*/


    _handleShowPopupClick() {
        this._changeMode();
       
        render(this._siteBodyContainer, this._popupComponent, RenderPosition.BEFOREEND);
        this._mode = Mode.EDITING;
        this._commentsModel.addObserver(this._handleModelEvent);

        this._siteBodyContainer.classList.add("hide-overflow");
        this._popupComponent.setExitBtnClickHandler(this._handleHidePopup);
        this._popupComponent.setAddToWatchBtnListClickHandler(this._handleAddToWatchedListClick);
        this._popupComponent.setAlreadyWatchedBtnClickHandler(this._handleAddToAlreadyWatchedClick);
        this._popupComponent.setAddToFavoriteBtnClickHandler(this._handleAddToFavoriteClick);
        this._popupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

        this._popupComponent.setAddCommentClickHandler(this._handleAddComment);

        document.addEventListener("keydown", this._onEscKeyDownHandler);

        // console.log(this._mode);
    }

    _handleHidePopup() {
        remove(this._popupComponent);
        this._commentsModel.removeObserver(this._handleModelEvent);
        this._popupComponent.reset(this._filmData);
        document.removeEventListener("keydown", this._onEscKeyDownHandler);
        this._siteBodyContainer.classList.remove("hide-overflow");
        this._mode = Mode.DEFAULT;
        
    }

    _handleMove() {
        this._filmCardComponent.getElement().querySelector(".film-card__title").style.cursor = "pointer";
    }


    _handleAddToWatchedListClick() {
        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._filmData,
                {
                    isWatchList: !this._filmData.isWatchList,
                },
            ),
        );
    }

    _handleAddToAlreadyWatchedClick() {
        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._filmData,
                {
                    isWatched: !this._filmData.isWatched,
                },
            ),
        );
    }

    _handleAddToFavoriteClick() {
        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._filmData,
                {
                    isFavorite: !this._filmData.isFavorite,
                },
            ),
        );
    }

    _handleDeleteCommentClick(deletedId) {
        this._changeData(
            UserAction.DELETE_COMMENT,
            UpdateType.PATCH,            
            this._commentsModel.getComments().find((comment) => comment.id === deletedId),
            //console.log(this._commentsModel.getComments().find((comment) => comment.id === deletedId))
        );

        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._filmData,
                {
                    comments: this._filmData.comments.filter((comment) => comment !== deletedId),
                },
            ),
        );
    }

    _handleAddComment(newComment) {
      
        this._changeData(
            UserAction.ADD_COMMENT,
            UpdateType.MINOR,
            newComment,
        );

        this._changeData(
            UserAction.UPDATE_MOVIE,
            UpdateType.PATCH,
            Object.assign(
                {},
                this._filmData,
                {
                    comments: [...this._filmData.comments, (newComment.id)],//data превращается в число здесь
                },
            ),
        );
    }

    _handleModelEvent(updateType, data) {
        switch (updateType) {
        case UpdateType.PATCH:
            // - обновить часть списка (например, когда удалили/добавили коммент)
            break;
        case UpdateType.MINOR:
            this._popupComponent.update(this._commentsModel.getComments(data.id));
            break;
        }
    }
}

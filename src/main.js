import {renderTemplate, render, RenderPosition, remove} from "./utils/render.js";
import {UpdateType, FilterType} from "./utils/constants.js";
import {siteFilterMap} from "./utils/filter.js";

import MainNavView from "./view/main-navigation.js";

import UserRank from "./view/user-rank.js";
import StatsView from "./view/statistic.js";

import {generateFilm, popupComments} from "./mock/film.js";

import {generateUseRank} from "./mock/rank.js";

import MovieListPresenter from "./presenter/movie-list.js";
import MenuFilterPresenter from "./presenter/filter.js";

import MoviesModel from "./model/movies.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";

const MOCK_FILMS_COUNT = 20;

const mainNavComponent = new MainNavView ();

const siteBody = document.querySelector("body");
const siteMainContainer = document.querySelector(".main");
const mainNavContainer = mainNavComponent.getElement().querySelector(".main-navigation__additional");

const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

const comments = popupComments;
const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(() => generateFilm(comments));
//console.log(mockFilms);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const moviesModel = new MoviesModel();
moviesModel.setMovies(mockFilms);

const filterModel = new FilterModel();
const statsComponent = new StatsView(moviesModel.getMovies());
const allWhatchedFilms = siteFilterMap[FilterType.HISTORY](mockFilms).length;
//FilterModel.setFilters(mockFilms);

//render(siteMainContainer, new Menu(filmFilters), RenderPosition.AFTERBEGIN);

const handleFilterMenuClick = (menuItem) => {
    const menuItemData = menuItem.dataset.itemType;
    const activeItem = document.querySelector(".main-navigation__item--active");
    switch (menuItemData) {
    case FilterType.ALL:
    case FilterType.WATCHLIST:
    case FilterType.HISTORY:
    case FilterType.FAVORITES:
        remove(statsComponent);// Скрыть статистику
        movieListPresenter.destroy();
        movieListPresenter.init();// Показать список фильмов
        menuItem.classList.add("main-navigation__item--active");
        mainNavContainer.classList.remove("main-navigation__item--active");
        break;
    case FilterType.STATISTICS:
        movieListPresenter.destroy();// Скрыть список фильмов
        activeItem.classList.remove("main-navigation__item--active");
        render(siteMainContainer, statsComponent, RenderPosition.BEFOREEND);
        statsComponent.setCharts(moviesModel.getMovies());
        mainNavContainer.classList.add("main-navigation__item--active");// Показать статистику
        break;
    }
};
  
mainNavComponent.setMenuClickHandler(handleFilterMenuClick);


render(siteMainContainer, mainNavComponent, RenderPosition.AFTERBEGIN);


renderTemplate (footerStat, `<p>${MOCK_FILMS_COUNT} movies inside</p>`, RenderPosition.BEFOREEND);

const filterPresenter = new MenuFilterPresenter (mainNavContainer, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(siteMainContainer, siteBody, moviesModel, commentsModel, filterModel);
render(siteHeader, new UserRank(generateUseRank(allWhatchedFilms)), RenderPosition.BEFOREEND);
filterPresenter.init();
movieListPresenter.init();
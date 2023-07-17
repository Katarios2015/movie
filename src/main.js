import {renderTemplate, render, RenderPosition, remove} from "./utils/render.js";
import {FilterType, UpdateType} from "./utils/constants.js";
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

import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
//import {isOnline} from "./utils/common.js";

const STORE_PREFIX = "cinemaddict-localstorage";
const STORE_VER = "v1";
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;


const AUTHORIZATION = "Basic 39w3ash4q2";
const END_POINT = "https://14.ecmascript.pages.academy/cinemaddict"; 

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainNavComponent = new MainNavView ();

const siteBody = document.querySelector("body");
const siteMainContainer = document.querySelector(".main");
const mainNavContainer = mainNavComponent.getElement().querySelector(".main-navigation__additional");

const siteHeader = document.querySelector(".header");
const siteFooter = document.querySelector(".footer");

const footerStat = siteFooter.querySelector(".footer__statistics");

//const comments = popupComments;
//const mockFilms = new Array(MOCK_FILMS_COUNT).fill().map(() => generateFilm(comments));


const commentsModel = new CommentsModel();
//commentsModel.setComments(comments);

const moviesModel = new MoviesModel();
//moviesModel.setMovies(mockFilms);

const filterModel = new FilterModel();
let statsComponent = null;
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
        statsComponent = new StatsView(moviesModel.getMovies());
        render(siteMainContainer, statsComponent, RenderPosition.BEFOREEND);
        statsComponent.setCharts(moviesModel.getMovies());
        mainNavContainer.classList.add("main-navigation__item--active");// Показать статистику
        break;
    }
};

const filterPresenter = new MenuFilterPresenter (mainNavContainer, filterModel, moviesModel);
const movieListPresenter = new MovieListPresenter(siteMainContainer, siteBody, moviesModel, commentsModel, filterModel, apiWithProvider);

filterPresenter.init();
movieListPresenter.init();

apiWithProvider.getMovies()
    .then((movies) => {
        moviesModel.setMovies(UpdateType.INIT, movies);
        render(siteMainContainer, mainNavComponent, RenderPosition.AFTERBEGIN);
        const allWhatchedFilms = siteFilterMap[FilterType.HISTORY](moviesModel.getMovies()).length;
        render(siteHeader, new UserRank(generateUseRank(allWhatchedFilms)), RenderPosition.BEFOREEND);
        
        mainNavComponent.setMenuClickHandler(handleFilterMenuClick);
        renderTemplate (footerStat, `<p>${moviesModel.getMovies().length} movies inside</p>`, RenderPosition.BEFOREEND);
    })
    .catch(() => {
        moviesModel.setMovies(UpdateType.INIT, []);
        render(siteMainContainer, mainNavComponent, RenderPosition.AFTERBEGIN);
        mainNavComponent.setMenuClickHandler(handleFilterMenuClick);
        console.log("error load");
    });

window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
});

window.addEventListener("online", () => {
    document.title = document.title.replace(" [offline]", "");
    apiWithProvider.sync();
});
  
window.addEventListener("offline", () => {
    document.title += " [offline]";
});
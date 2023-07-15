import AbstractView from "./abstract.js";
import {FilterType} from "../utils/constants.js";

const createMenuTemplate = () => {
    return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional"href="#" data-item-type="${FilterType.STATISTICS}">Stats</a>
  </nav>`;
};

export default class MainNav extends AbstractView {
    constructor() {
        super();
    
        this._menuClickHandler = this._menuClickHandler.bind(this);
    }

    getTemplate () {
        return createMenuTemplate();
    }

    _menuClickHandler(evt) {
        if (evt.target.tagName !== "A") {
            return;
        }
        evt.preventDefault();
        this._callback.menuClick(evt.target);
    }
    
    setMenuClickHandler(callback) {
        this._callback.menuClick = callback;
        this.getElement().addEventListener("click", this._menuClickHandler);
    }
}
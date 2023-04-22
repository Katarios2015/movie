import {createElement} from "../render.js";


const createFilterItemTemplate = (filter)=> {
    const {name, count} = filter;
    return (
        `<a href="#${name}" class="main-navigation__item">${name[0].toUpperCase()+ name.slice(1)}<span class="main-navigation__item-count">${count}</span></a>
        `
    );
};

const createMenuTemplate = (filterItems) => {
    const filterItemsTemplate = filterItems
        .filter((film) => film.name != "all")
        .map((filter) => createFilterItemTemplate(filter)).join("");
    return `<nav class="main-navigation">
    <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class Menu {
    constructor(filterItems) {
        this._filterItems = filterItems;
        this._element = null;
    }

    getTemplate () {
        return createMenuTemplate(this._filterItems);
    }

    getElement () {
        if(!this._element) {
            this._element = createElement(this.getTemplate());
        }
        
        return this._element;
    }
    
    removeElement () {
        this._element = null;
    }
}

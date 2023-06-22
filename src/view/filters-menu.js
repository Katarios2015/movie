import AbstractView from "./abstract.js";

export const createFilterItemTemplate = (filter, currentFilterType)=> {
    const {type, name, count} = filter;
    if (name === "All movies") {
        return `<a href="#${name}" data-item-type="${type}" 
        class="main-navigation__item ${type === currentFilterType 
        ? "main-navigation__item--active" : ""}">${name}</a>`;
    }
    return (
        `<a href="#${name}" data-item-type="${type}" class="main-navigation__item 
        ${type === currentFilterType 
            ? "main-navigation__item--active" : ""}">${name}
            <span class="main-navigation__item-count">${count}</span>
        </a>`
    );
};

const createFiltersMenuTemplate = (filterItems, currentFilterType) => {
    const filterItemsTemplate = filterItems
        .filter((film) => film.name)
        .map((filter) => createFilterItemTemplate(filter, currentFilterType)).join("");
    return `<div class="main-navigation__items">
    ${filterItemsTemplate}</div>`;
};


export default class Menu extends AbstractView {
    constructor(filterItems, currentFilterType) {
        super();
        this._filterItems = filterItems;
        this._currentFilter = currentFilterType;

        this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    }

    getTemplate () {
        return createFiltersMenuTemplate(this._filterItems, this._currentFilter);
    }

    _filterTypeChangeHandler(evt) {
        if (evt.target.tagName !== "A") {
            return;
        }
        evt.preventDefault();
        this._callback.filterTypeChange(evt.target.dataset.itemType);
    }
    
    setFilterTypeChangeHandler(callback) {
        this._callback.filterTypeChange = callback;
        this.getElement().addEventListener("click", this._filterTypeChangeHandler);
        
    }
}

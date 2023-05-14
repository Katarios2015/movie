import AbstractView from "./abstract.js";
import {SortType} from "../utils/common.js";

const createSortTemplate = () => {

    /*return `<ul class="sort">
    <li><a href="#" class="sort__button ${currentType === SortType.DEFAULT ? "sort__button--active" : ""}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentType === SortType.DATE ? "sort__button--active" : ""}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentType === SortType.RATE ? "sort__button--active" : ""}" data-sort-type="${SortType.RATE}">Sort by rating</a></li>
  </ul>`;*/
    return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATE}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {

    constructor() {
        super();
        //this.currentType = currentType;
        this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    }

    getTemplate () {
        return createSortTemplate();
    }

    _sortTypeChangeHandler(evt) {
        if (evt.target.tagName !== "A") {
            return;
        }
    
        evt.preventDefault();
        this._callback.sortTypeChange(evt.target.dataset.sortType);
        
    }
    
    setSortTypeChangeHandler(callback) {
        this._callback.sortTypeChange = callback;
        this.getElement().addEventListener("click", this._sortTypeChangeHandler);
    }

}
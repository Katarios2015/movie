import {createElement} from "../render.js";

export const createShowMoreBtnTemplate = () => {
    // eslint-disable-next-line quotes
    return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreBtn {
    constructor() {
        this._element = null;
    }

    getTemplate() {
        return createShowMoreBtnTemplate();
    }

    getElement(){
        if(!this._element) {

            this._element = createElement(this.getTemplate());
        }
        return this._element;
    }

    removeElment() {
        this._element = null;
    }
}
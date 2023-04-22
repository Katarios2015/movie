import {createElement} from "../render.js";

const createExtraSectionTemplate = () => {
    return `<section class="films-list films-list--extra">

    <div class="films-list__container">
    </div>
  </section>`;
};

export default class ExtraSection {
    constructor() {
        this._element = null;
    }
    
    getTempleate() {
        return createExtraSectionTemplate();
    }

    getElement() {
        if(!this._element) {
            this._element = createElement(this.getTempleate());
        }
        return this._element;
    }

    removeElement() {
        this._element = null;
    }

}
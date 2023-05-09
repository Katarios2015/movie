import AbstractView from "./abstract.js";

const createExtraSectionTemplate = () => {
    
    return `<section class="films-list films-list--extra films-list--rate">
        <h2 class="films-list__title">Top rated</h2>
        <div class="films-list__container">
        </div>
      </section>`;
    
};

export default class ExtraSection extends AbstractView {
    
    
    getTemplate() {
        return createExtraSectionTemplate();
    }

}
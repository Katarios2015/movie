import AbstractView from "./abstract.js";

const createExtraSectionTemplate = () => {
    return `<section class="films-list films-list--extra">

    <div class="films-list__container">
    </div>
  </section>`;
};

export default class ExtraSection extends AbstractView {
    
    
    getTemplate() {
        return createExtraSectionTemplate();
    }

}
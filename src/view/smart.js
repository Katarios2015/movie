import AbstractView from "./abstract.js";

export default class Smart extends AbstractView {
    constructor() {
        super();
        this._data = {};
    }

    restoreHandlers () {
        throw new Error("Abstract method not implemented: resetHandlers");
        //абстрактный метод
        //навешивает обработчики событий зано
    }

    updateElement () {
        //обычный метод 
        const prevElement = this.getElement();
        const parent = prevElement.parentElement;
        this.removeElement();//удалить старый DOM-элемент компонента
        const scrollTop = prevElement.scrollTop;
    
        const newElement = this.getElement(); //создать новый DOM-элемент;
        
        parent.replaceChild(newElement, prevElement);//поместить новый элемент вместо старого;
        
        newElement.scrollTop = scrollTop;
        this.restoreHandlers(); //восстановить обработчики событий, вызвав restoreHandlers.
    }

    updateData (update, justDataUpdating = false) {
        //обычный метод 
        if (!update) {
            return;
        }
      
        this._data = Object.assign(
            {},
            this._data,
            update,
        );

        if (!justDataUpdating) {
            this.updateElement(); //будет обновлять данные и, если нужно, вызывать метод updateElement
        }
      
       

    }



}
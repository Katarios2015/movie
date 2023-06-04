
import Observer from "../utils/common.js" ;

export default class Comments extends Observer{
    constructor () {
        super();
        this._comments = [];
    }

    setMovies (comments) {
        this._comments = comments.slice();
    }

    getMovies () {
        return this._comments;
    }

    /*updateComment () {

    }*/
 
    addComment(updateType, update) {
        this._comments = [
            update,
            ...this._comments,
        ];
    
        this._notify(updateType, update);
    }
    
    deleteComment(updateType, update) {
        const index = this._comments.findIndex((comment) => comment.id === update.id);
    
        if (index === -1) {
            throw new Error("Can't delete unexisting task");
        }
    
        this._tasks = [
            ...this._comments.slice(0, index),
            ...this._comments.slice(index + 1),
        ];
    
        this._notify(updateType);
    }
}
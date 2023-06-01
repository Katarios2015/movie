
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

    updateComment () {}
    //init () {}
}

import Observer from "../utils/common.js" ;

export default class Movies extends Observer{
    constructor () {
        super();
        this._movies = [];
    }

    setMovies (movies) {
        this._movies = movies.slice();
    }

    getMovies () {
        return this._movies;
    }
    
    updateMovie () {}
    //init () {}
}
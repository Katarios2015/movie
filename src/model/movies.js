
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
    
    updateMovie (updateType, update) {
        const index =  this._movies.findIndex((item) => item.id === update.id);
    
        if (index === -1) {
            throw new Error("Can't delete unexisting movies");
        }
    
        this._movies = [
            ...this._movies.slice(0, index),
            update,
            ...this._movies.slice(index + 1),
        ];

        this._notify(updateType, update);
    }
}
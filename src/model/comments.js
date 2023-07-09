
import Observer from "../utils/common.js" ;

export default class Comments extends Observer {
    constructor () {
        super();
        this._comments = [];
    }

    setComments (comments) {
        this._comments = comments.slice();
    }

    getComments () {
        return this._comments;
    }
 
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
            throw new Error("Can't delete unexisting comment");
        }
    
        this._comments = [
            ...this._comments.slice(0, index),
            ...this._comments.slice(index + 1),
        ];
    
        this._notify(updateType, update);
    }

    static adaptToClient(comment) {
        const adaptedComment = Object.assign(
            {},
            comment,
            {

                date: comment.date !== null ? new Date(comment.date) : comment.date,
            },
        );
        
        return adaptedComment;
    }

    static adaptToServer(comment) {
        const adaptedComment = Object.assign(
            {},
            comment,
            {
                "date": comment.date  instanceof Date ? comment.date.toISOString() : null,
            },
        );
        // Ненужные ключи мы удаляем
        return adaptedComment;
    }
}//"date": movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null,
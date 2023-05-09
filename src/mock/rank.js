import {getRandomArrayElement, getRandomCeilNumber} from "../utils/common.js";

const ranks = ["novice", "fan", "movie buff"];
const photosAvatar = ["./images/bitmap@2x.png","./images/bitmap@2x.png"];


const getUserRank = () => {
    let whatchedFilmsCount = getRandomCeilNumber(0, 30);
    let userRank = "";
    if (whatchedFilmsCount >=1 && whatchedFilmsCount<= 10) {
        userRank = ranks[0];
    } else if (whatchedFilmsCount >=11 && whatchedFilmsCount<= 20) {
        userRank = ranks[1];
    }else if (whatchedFilmsCount >=21 ) {
        userRank = ranks[2];
    }
    return userRank;
};

;

const generateUseRank = () => {

    return {
        rank: getUserRank(),
        avatar: getRandomArrayElement(photosAvatar)
    };
};

export {generateUseRank};

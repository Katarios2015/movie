import {getRandomArrayElement, getUserRank} from "../utils/common.js";


const photosAvatar = ["./images/bitmap@2x.png","./images/bitmap@2x.png"];

const generateUseRank = (whatchedFilmsCount) => {

    return {
        rank: getUserRank(whatchedFilmsCount),
        avatar: getRandomArrayElement(photosAvatar)
    };
};

export {generateUseRank, getUserRank};

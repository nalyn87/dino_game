import { getGameAssets } from "../init/assets.js";
import { clearItem } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {
    const { stages } = getGameAssets();

    clearStage(uuid);
    clearItem(uuid);

    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage: ', getStage(uuid));
    
    return {status: 'success'};
}

export const gameEnd = (uuid, payload) => {
    const {timestamp:gameEndTime, score} = payload;
    const stages = getStage(uuid);

    if (!stages.length) {
        return {status: 'fail', message: '유저의 스테이지가 존재하지 않습니다'}
    }

    let totalScore = 0;
    stages.forEach((stage, index) => {
        let stageEndTime;
        if (index === stages.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }

        const stageDuration = (stageEndTime - stage.timestamp) / 1000
        totalScore += stageDuration;
    })

    if (Math.abs(score - totalScore) > 5) {
        return {status: 'fail', message: '스코어가 잘못되었습니다'}
    }

    return {status: 'success', message: '게임이 종료되었습니다', score};
}
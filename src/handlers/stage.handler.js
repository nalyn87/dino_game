import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: '스테이지가 유저에게 존재하지 않습니다' };
  }
  console.log(payload);

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 해당 스테이지 검증
  if (payload.currentStage !== currentStage.id) {
    return { status: 'fail', message: '잘못된 해당 스테이지입니다' };
  }

  // 점수 검증
  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 다음 스테이지 검증
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: '다음 스테이지가 존재하지 않습니다' };
  }

  // 과제
  if (elapsedTime < stages.data[currentStages.length].score || elapsedTime > (stages.data[currentStages.length].score + 1)) {
    return {status: 'fail', message: '유효하지 않은 경과 시간입니다'}
  }

  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success' };
};

import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const getItemHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  let currentItem = getItem(userId);
  const { currentStage, itemId, itemScore } = payload;

  if (!currentStages.length) {
    return { status: 'fail', message: '스테이지가 유저에게 존재하지 않습니다' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const userCurrentStage = currentStages[currentStages.length - 1];

  // 해당 스테이지 검증
  if (currentStage !== userCurrentStage.id) {
    return { status: 'fail', message: '잘못된 해당 스테이지입니다' };
  }

  // 아이템 언락 검증
  const { itemUnlocks, items } = getGameAssets();
  if (
    !itemUnlocks.data.some(
      (data) => data.stage_id === currentStage && data.item_ids.some((item) => item === itemId),
    )
  ) {
    return { status: 'fail', message: '해당 스테이지에서 해금되지 않은 아이템입니다' };
  }

  // 아이템 점수 검증
  if (!items.data.some((item) => item.id === itemId && item.score === itemScore)) {
    return { status: 'fail', message: '아이템의 점수가 잘못되었습니다' };
  }

  setItem(userId, itemId);
  return { status: 'success' };
};

import { sendEvent, socket } from './Socket.js';
import stageData from './assets/stage.json' with { type: 'json' };
import itemsData from './assets/item.json' with { type: 'json' };
import itemUnlocks from './assets/item_unlock.json' with { type: 'json' };

export let stage = 0;
let highScore = 0;
socket.on('broadcast', (data) => {
  highScore = data;
});

class Score {
  score = 0;
  stageChange = true;
  time = 0;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * stageData.data[stage].scorePerSecond;
    this.time += deltaTime * 0.001;
    if (stage === 6) {
      return;
    }

    if (Math.floor(this.time) === stageData.data[stage + 1].score && this.stageChange) {
      console.log(stage + 1, '스테이지 클리어');
      sendEvent(11, {
        currentStage: stageData.data[stage].id,
        targetStage: stageData.data[stage + 1].id,
      });
      stage++;
    }
  }

  getItem(itemId) {
    const currentStage = stageData.data[stage].id;

    sendEvent(12, {
      currentStage,
      itemId,
      itemScore: itemsData.data[itemId - 1].score,
    });
    if (
      !itemUnlocks.data.some(
        (data) => data.stage_id === currentStage && data.item_ids.some((item) => item === itemId),
      )
    ) {
      return { status: 'fail', message: '해당 스테이지에서 해금되지 않은 아이템입니다' };
    } else this.score += itemsData.data[itemId - 1].score;
  }

  reset() {
    this.score = 0;
    this.time = 0;
    stage = 0;
  }

  setHighScore() {
    if (this.score > highScore) {
      sendEvent(13, { score: this.score });
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;

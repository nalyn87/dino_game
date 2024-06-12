import { sendEvent } from './Socket.js';
import stageData from './assets/stage.json' with { type: 'json' };
import itemsData from './assets/item.json' with { type: 'json' };

export let stage = 0;

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
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
      console.log(stage + 1, '스테이지 클리어')
      sendEvent(11, { currentStage: stageData.data[stage].id, targetStage: stageData.data[stage + 1].id });
      stage++;
    }
  }

  getItem(itemId) {
    sendEvent(12,{currentStage: stageData.data[stage].id, itemId, itemScore: itemsData.data[itemId - 1].score})
    this.score += itemsData.data[itemId - 1].score;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
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

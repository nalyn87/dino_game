export let highScore = 0;

export const setHighScore = (userId, payload) => {
  const { score } = payload;
  if (score > highScore) {
    highScore = Math.floor(score);
    return { broadcast: highScore };
  }
  return { status: 'success' };
};

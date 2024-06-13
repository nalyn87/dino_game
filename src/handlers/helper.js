import { getGameAssets } from '../init/assets.js';
import { removeUser, getUser } from '../models/user.model.js';
import { setStage, getStage, createStage } from '../models/stage.model.js';
import handlerMappings from './handlerMapping.js';
import { CLIENT_VERSION } from '../constants.js';
import { highScore } from '../handlers/score.handler.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`${socket.id} 유저가 연결을 종료하였습니다`);
  console.log('현재 유저: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`새로운 유저가 접속하였습니다: ${uuid}`);
  console.log('현재 유저: ', getUser());

  createStage(uuid);

  socket.emit('connection', { uuid });
  socket.emit('response', highScore);
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: '클라이언트 버전이 맞지 않습니다' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: '핸들러가 존재하지 않습니다' });
    return;
  }

  const response = handler(data.userId, data.payload);
  if (response.broadcast) {
    const highScore = response.broadcast;
    io.emit('broadcast', highScore);
    return;
  }
  socket.emit('response', response);
};

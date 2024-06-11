import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(PORT, async () => {
  console.log(PORT, '서버가 정상적으로 실행되었습니다!');

  // 자료 읽기
  try {
      const assets = await loadGameAssets();
      console.log(assets);
      console.log('게임 자료들이 성공적으로 로딩되었습니다!');
  } catch (err) {
    console.error('게임 자료들의 로딩이 실패하였습니다', err)
  }
});

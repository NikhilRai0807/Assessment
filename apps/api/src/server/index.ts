import { createApp } from '../app/createApp';

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

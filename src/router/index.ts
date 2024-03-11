import { createRouter, createWebHashHistory } from 'vue-router';
import Directories from './routes/directories';
import Directory from './routes/directory';
import EmptyStates from './routes/empty';
import Error from './routes/error';

const router = createRouter({
  history: createWebHashHistory(), // Must use Hash mode for Electron
  routes: [
    ...Error,
    ...Directories,
    ...EmptyStates,
    ...Directory,
  ],
});

export default router;
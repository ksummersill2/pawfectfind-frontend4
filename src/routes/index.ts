import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public';

export const router = createBrowserRouter([
  ...publicRoutes
]);
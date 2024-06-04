import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '@redux/store';
import App from './App';
import '@core/style/global.scss';
import '@core/style/library-override.scss';
import 'react-toastify/dist/ReactToastify.css';
import '@core/style/lib.scss';
import './i18n.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);

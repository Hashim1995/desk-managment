import { GlobalToken, ThemeConfig } from 'antd';
import { ToastOptions } from 'react-toastify';

const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined
};

const getTimeLineStyle = (token: GlobalToken) => ({
  fontSize: token.fontSizeHeading4,
  marginBottom: token.marginXS,
  marginTop: '7px',
  padding: token.paddingXS,
  borderColor: token.colorPrimary,
  borderWidth: token.lineWidth,
  borderStyle: 'solid',
  borderRadius: token.borderRadius,
  color: token.colorPrimary
});

const themeConfig = (
  darkMode: any,
  darkAlgorithm: any,
  defaultAlgorithm: any
): ThemeConfig => ({
  token: {
    paddingXL: 28,
    paddingLG: 20,
    paddingMD: 16,
    paddingSM: 10,
    paddingXS: 6,
    paddingXXS: 2,
    fontSizeXL: 17,
    fontSizeLG: 14,
    fontSizeSM: 10,
    colorBorder: '#e6e1e1',
    colorPrimary: '#006FEE',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    colorLink: '#000'
  },
  components: {
    Layout: {
      colorBgHeader: darkMode ? '#141414' : '#006FEE',
      colorBgTrigger: darkMode ? '#141414' : '#006FEE',
      colorBgBody: darkMode ? '#202020' : '#f5f5f5'
    },

    Form: {
      marginLG: 8
    },
    Tabs: {
      horizontalMargin: ' 0 0 10px 0'
    },
    Menu: {
      iconSize: 17,
      popupBg: 'red',
      // colorBgContainer: darkMode ? '':  '#006FEE',
      itemColor: darkMode ? '#fff' : '#006FEE',
      itemSelectedColor: '#fff',
      itemHoverBg: '#006FEE',
      itemHoverColor: '#fff',
      itemSelectedBg: '#006FEE',
      motionDurationFast: '0s',
      motionDurationSlow: '0s',
      // motionDurationMid: '0s',
      controlItemBgActiveHover: 'red'
      // darkItemHoverBg: 'purple',
      // darkItemColor: 'pink',
      // horizontalItemHoverColor: 'red',
      // itemHoverBg: '#red',
      // darkItemBg: 'pink',
      // darkItemSelectedBg: 'red',
      // itemBg: darkMode ? '#141414' : '#006FEE',
      // itemSelectedBg: darkMode ? '#006FEE' : '#fff',
      // itemSelectedColor: darkMode ? '#fff' : '#000',
    },
    Modal: {
      wireframe: true
    },
    Button: {
      colorPrimaryHover: '#006FEE'
    }
  },
  algorithm: darkMode ? darkAlgorithm : defaultAlgorithm
});

export { toastOptions, getTimeLineStyle, themeConfig };

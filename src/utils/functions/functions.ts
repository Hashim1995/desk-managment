/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-prototype-builtins */
import { Modal } from 'antd';
import { selectOption } from '@/models/common';
import { IHTTPSParams } from '@/services/adapter-config/config';
import i18next from 'i18next';

const userToken: any = localStorage.getItem('userToken');
/* eslint-disable no-restricted-syntax */
function convertFormDataToQueryParams<T>(formData: T): IHTTPSParams[] {
  const z: IHTTPSParams[] = [];
  for (const key in formData) {
    if (formData?.hasOwnProperty(key)) {
      z.push({
        name: key,
        value: formData[key] as string | number | null | selectOption
      });
    }
  }
  return z;
}

interface IshowCloseConfirmationModal {
  onClose: () => void;
  titleText?: string;
  descriptionText?: string;
  closeText?: string;
  okText?: string;
  isDark?: boolean;
  t?: any;
}

const showCloseConfirmationModal = ({
  onClose,
  titleText,
  descriptionText,
  closeText,
  isDark,
  okText
}: IshowCloseConfirmationModal) => {
  Modal.confirm({
    title: titleText ?? i18next.t('confirmTitle'),
    content: descriptionText ?? i18next.t('confirmDelete'),
    onOk: onClose,
    cancelText: closeText ?? i18next.t('noTxt'),
    okText: okText ?? i18next.t('yesTxt'),
    className: `confirmModal ${isDark ? 'confirmModalDark' : ''}`,
    okButtonProps: { style: { backgroundColor: '#006FEE' } }
  });
};

const showDeleConfirmationModal = ({
  onClose,
  titleText,
  descriptionText,
  closeText,
  isDark,
  okText
}: IshowCloseConfirmationModal) => {
  Modal.confirm({
    title: titleText ?? i18next.t('confirmTitle'),
    content: descriptionText ?? i18next.t('confirmDelete'),
    onOk: onClose,
    cancelText: closeText ?? i18next.t('noTxt'),
    okText: okText ?? i18next.t('yesTxt'),
    className: `confirmModal ${isDark ? 'confirmModalDark' : ''}`,
    okButtonProps: { style: { backgroundColor: '#006FEE' } }
  });
};

function convertBytesToReadableSize(bytes: number): string {
  const suffixes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let i: number = 0;
  while (bytes >= 1024 && i < suffixes.length - 1) {
    bytes /= 1024;
    i++;
  }

  const sizeFormat: string = `${bytes?.toFixed(1)} ${suffixes[i]}`;
  return sizeFormat;
}

function formatDate(inputDateTime: string | Date): string {
  const date = new Date(inputDateTime);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function generateOptionListPerNumber(num: number): selectOption[] {
  const data = [];
  for (let i = 1; i < num + 1; i++) {
    data.push({
      value: i,
      label: `${i}`
    });
  }
  return data;
}

const tokenizeImage = async (file: any): Promise<any> => {
  const newFile = {
    ...file,
    status: 'done'
  };

  const src = newFile.fileUrl;
  const cache = await caches.open('imageCache');
  const cachedResponse = await cache.match(src);
  if (cachedResponse) {
    const blob = await cachedResponse.blob();
    const objectUrl = URL.createObjectURL(blob);
    newFile.url = objectUrl;
  } else {
    const response = await fetch(src, {
      headers: {
        AuthPerson: userToken?.replace(/['"]+/g, '')
      }
    });
    if (response.ok) {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      src && (await cache.put(src, new Response(blob)));
      newFile.url = objectUrl;
    }
  }
  return newFile;
};

function toCapitalize(str: string): string {
  const words: string[] = str.split(' ');
  const capitalizedWords: string[] = words.map(
    (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return capitalizedWords.join(' ');
}

function findEnumValue(object: Record<string, any>, targetValue: any) {
  const keys = Object.keys(object);

  const foundKey = keys?.find(key => object[key] == targetValue);

  return foundKey || null;
}

function inputPlaceholderText(param?: string): string {
  return param ? `${param} ${i18next.t('enterTheBox')}` : i18next.t('enter');
}

function selectPlaceholderText(param?: string): string {
  return param
    ? `${param} ${i18next.t('selectFromTheBox')}`
    : i18next.t('select');
}

function onlyNumber(param?: string): string {
  return param
    ? `${param} ${i18next.t('fieldMustContainOnlyNumbers')}`
    : i18next.t('onlyDigitsField');
}

function inputValidationText(param?: string): string {
  return param
    ? `${param} ${i18next.t('fieldIsRequired')}`
    : i18next.t('required');
}

function minLengthCheck(param: string, l: string): string {
  return `${param} ${i18next.t('fieldAtLeast')} ${l} ${i18next.t(
    'shouldConsistOfCharacter'
  )}`;
}
function maxLengthCheck(param: string, l: string): string {
  return `${param} ${i18next.t('fieldAtTheMost')} ${l} ${i18next.t(
    'mustBeCharacter'
  )}`;
}

function getLanguageName(languageNumber: number): string {
  switch (languageNumber) {
    case 1:
      return 'Az';
    case 2:
      return 'Eng';
    case 3:
      return 'Ru';
    default:
      throw new Error('Invalid language number');
  }
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    const arrCopy = [] as any[];
    obj.forEach((_, i) => {
      arrCopy[i] = deepClone(obj[i]);
    });
    return arrCopy as T;
  }

  if (obj instanceof Set) {
    const setCopy = new Set<any>();
    obj.forEach(value => {
      setCopy.add(deepClone(value));
    });
    return setCopy as T;
  }

  if (obj instanceof Map) {
    const mapCopy = new Map<any, any>();
    obj.forEach((value, key) => {
      mapCopy.set(key, deepClone(value));
    });
    return mapCopy as T;
  }

  const objCopy = {} as { [key: string]: any };
  Object.keys(obj).forEach(key => {
    objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
  });

  return objCopy as T;
}


export {
  convertFormDataToQueryParams,
  generateOptionListPerNumber,
  convertBytesToReadableSize,
  showCloseConfirmationModal,
  showDeleConfirmationModal,
  // formatDateToWords,
  tokenizeImage,
  getLanguageName,
  formatDate,
  toCapitalize,
  findEnumValue,
  inputPlaceholderText,
  selectPlaceholderText,
  onlyNumber,
  deepClone,
  inputValidationText,
  minLengthCheck,
  maxLengthCheck
};

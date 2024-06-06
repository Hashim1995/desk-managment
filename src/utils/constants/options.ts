/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import i18next from 'i18next';
import { selectOption } from '@/models/common';
import { NomeclaturaType } from '@/enums';

const statusOptions: selectOption[] = [
  {
    value: '1',
    label: i18next.t('active')
  },
  {
    value: '2',
    label: i18next.t('deactivated')
  }
];

const isBlockedOptions: selectOption[] = [
  {
    value: '1',
    label: i18next.t('blocked')
  },
  {
    value: '2',
    label: i18next.t('unblocked')
  }
];

const roleOptions: selectOption[] = [
  {
    value: '1',
    label: i18next.t('admin')
  },
  {
    value: '2',
    label: i18next.t('moderator')
  }
];

const docStatusOptions: selectOption[] = [
  {
    value: 1,
    label: i18next.t('docStatusAgree')
  },
  {
    value: 2,
    label: i18next.t('docStatusSign')
  }
];

const fileTypeOptions: selectOption[] = [
  {
    value: 1,
    label: i18next.t('fileTypeIsMain')
  },
  {
    value: 2,
    label: i18next.t('fileTypeIsPrivate')
  }
];

const genderOptions: selectOption[] = [
  {
    value: '1',
    label: i18next.t('male')
  },
  {
    value: '2',
    label: i18next.t('female')
  }
];

const nomeclaturaTypeOptions: selectOption[] = [
  {
    value: NomeclaturaType.Mal,
    label: i18next.t('goods')
  },
  {
    value: NomeclaturaType.Hazırlama,
    label: i18next.t('preparation')
  },
  {
    value: NomeclaturaType.Modificator,
    label: i18next.t('modificator')
  },
  {
    value: NomeclaturaType.Məhsul,
    label: i18next.t('product')
  },
  {
    value: NomeclaturaType.Tarif,
    label: i18next.t('tariff')
  },
  {
    value: NomeclaturaType.Xidmət,
    label: i18next.t('service')
  }
];

const languagesOptions = [
  { label: 'Az', value: 1 },
  { label: 'Eng', value: 2 },
  { label: 'Ru', value: 3 }
];

const DatePickerLanguage = {
  lang: {
    placeholder: 'Tarix seçin',
    rangePlaceholder: ['Başlama tarixi', 'Bitmə tarixi'],
    locale: 'az_AZ',
    today: 'Bugün',
    now: 'İndi',
    backToToday: 'Bugünə qayıt',
    ok: 'Təsdiq',
    clear: 'Təmizlə',
    month: 'Ay',
    year: 'İl',
    timeSelect: 'vaxtı seç',
    dateSelect: 'tarixi seç',
    weekSelect: 'Həftə seç',
    monthSelect: 'Ay seç',
    yearSelect: 'il seç',
    decadeSelect: 'Onillik seçin',
    yearFormat: 'YYYY',
    dateFormat: 'D.M.YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'D.M.YYYY HH:mm:ss',
    monthBeforeYear: true,
    previousMonth: 'Əvvəlki ay (PageUp)',
    nextMonth: 'Növbəti ay (PageDown)',
    previousYear: 'Sonuncu il (Control + left)',
    nextYear: 'Növbəti il (Control + right)',
    previousDecade: 'Sonuncu onillik',
    nextDecade: 'Növbəti onillik',
    previousCentury: 'Sonuncu əsr',
    nextCentury: 'Növbəti əsr',
    shortWeekDays: ['B.', 'B.E.', 'Ç.A.', 'Ç.', 'C.A.', 'C.', 'Ş.'],
    shortMonths: [
      'Yan',
      'Fev',
      'Mar',
      'Apr',
      'May',
      'İyun',
      'İyul',
      'Avq',
      'Sen',
      'Okt',
      'Noy',
      'Dek'
    ]
  },

  timePickerLocale: {
    placeholder: 'Vaxtı seç'
  },
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  weekFormat: 'YYYY-wo',
  monthFormat: 'YYYY-MM'
};

export {
  genderOptions,
  roleOptions,
  fileTypeOptions,
  docStatusOptions,
  isBlockedOptions,
  statusOptions,
  nomeclaturaTypeOptions,
  languagesOptions,
  DatePickerLanguage
};

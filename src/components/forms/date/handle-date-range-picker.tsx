import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { DatePicker, Form, FormItemProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { t } from 'i18next';

interface IAppHandledDateRangePicker {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: [string, string];
  errors?: any;
  onChangeApp?: any;
  dateProps?: RangePickerProps;
  formItemProps?: FormItemProps;
}

function AppHandledDateRangePicker({
  label,
  name,
  control,
  rules,
  required,
  placeholder = [t('startDate'), t('endDate')],
  errors,
  onChangeApp,
  dateProps,
  formItemProps
}: IAppHandledDateRangePicker) {
  const { RangePicker } = DatePicker;

  return (
    <Form.Item
      label={
        <span style={{ whiteSpace: 'nowrap', fontWeight: '400' }}>{label}</span>
      }
      // labelCol={{ span: 24 }}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
      {...formItemProps}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <RangePicker
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            // @ts-ignore
            locale={DatePickerLanguage}
            placeholder={placeholder}
            {...dateProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledDateRangePicker;

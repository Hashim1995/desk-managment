import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { DatePicker, Form, FormItemProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import i18next from 'i18next';
import { DatePickerLanguage } from '@/utils/constants/options';

/**
 * A custom date range picker component that integrates with React Hook Form and Ant Design for controlled input management, validation, error handling, and internationalization.
 *
 * @param {IAppHandledDateRangePicker} props - Component properties
 * @param {string} props.label - Text label displayed next to the date range picker.
 * @param {string} props.name - Unique identifier for the date range picker field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the date range field. Excludes options specific to numeric values.
 * @param {boolean} [props.required=false] - Whether the date range picker is required.
 * @param {string[]} [props.placeholder] - An array containing placeholder text for the start and end dates (optional). Defaults to translated values for "startDate" and "endDate" using i18next.
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {(event: React.ChangeEvent<Date[]>) => void} [props.onChangeApp] - Callback function invoked when the date range changes, allowing additional application-specific logic (optional).
 * @param {RangePickerProps} [props.dateProps] - Additional props to be passed directly to the underlying Ant Design `RangePicker` component (optional).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 *
 * @returns {JSX.Element} - The rendered date range picker component with label, validation, error handling, and optional localization.
 */

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
  placeholder = [i18next.t('startDate'), i18next.t('endDate')],
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
/**
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledDateRangePicker from './AppHandledDateRangePicker'; // Assuming AppHandledDateRangePicker is imported
 * import moment from 'moment'; // Optional for date manipulation (replace with your preferred date library)
 *
 * function MyForm() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   const handleSubmit = (data) => {
 *     console.log('Form data:', data);
 *     const formattedRange = [moment(data.bookingRange[0]).format('YYYY-MM-DD'), moment(data.bookingRange[1]).format('YYYY-MM-DD')]; // Optional formatting
 *     console.log('Formatted date range:', formattedRange);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <AppHandledDateRangePicker
 *         label="Booking Date Range"
 *         name="bookingRange"
 *         control={control}
 *         rules={{ required: true }}
 *         errors={errors}
 *         placeholder={['Start Date', 'End Date']} // Custom placeholder
 *         dateProps={{ format: 'YYYY-MM-DD' }} // Set date format (optional)
 *         onChangeApp={(range) => console.log('Date range changed:', range)}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */

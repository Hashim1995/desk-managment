import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { TimePicker, Form, FormItemProps, TimePickerProps } from 'antd';
import locale from 'antd/es/date-picker/locale/de_DE';
import { useTranslation } from 'react-i18next';

/**
 * A custom time picker component that integrates with React Hook Form and Ant Design for controlled input management, validation, error handling, and internationalization.
 *
 * @param {IAppHandledTime} props - Component properties
 * @param {string} props.label - Text label displayed next to the time picker.
 * @param {string} props.name - Unique identifier for the time picker field within the form.
 * @param {Controller<any, any>} props.control - The `control` object provided by `useForm` from React Hook Form.
 * @param {Omit<RegisterOptions<FieldValues>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>} [props.rules] - Validation rules to be applied to the time field. Excludes options specific to numeric or date values.
 * @param {boolean} [props.required=false] - Whether the time picker is required.
 * @param {string} [props.placeholder] - Placeholder text displayed within the time picker (optional).
 * @param {object} [props.errors] - Error object obtained from the `formState` of React Hook Form, containing error messages for the specific field (optional).
 * @param {(event: React.ChangeEvent<Date>) => void} [props.onChangeApp] - Callback function invoked when the time changes, allowing additional application-specific logic (optional).
 * @param {TimePickerProps} [props.dateProps] - Additional props to be passed directly to the underlying Ant Design `TimePicker` component (optional).
 * @param {FormItemProps} [props.formItemProps] - Additional props to be passed directly to the Ant Design `Form.Item` component (optional).
 *
 * @returns {JSX.Element} - The rendered time picker component with label, validation, error handling, and optional localization.
 */

interface IAppHandledTime {
  label?: string;
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  required?: boolean;
  placeholder?: string;
  errors?: any;
  onChangeApp?: any;
  dateProps?: TimePickerProps;
  formItemProps?: FormItemProps;
}

function AppHandledTime({
  label,
  name,
  control,
  rules,
  required,
  placeholder,
  errors,
  onChangeApp,
  dateProps,
  formItemProps
}: IAppHandledTime) {
  const { t } = useTranslation();

  return (
    <Form.Item
      label={<span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
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
          <TimePicker
            value={value}
            status={required && errors[name] ? 'error' : undefined}
            className="gap-in-time-picker-footer"
            onChange={e => {
              onChange(e);
              onChangeApp && onChangeApp(e);
            }}
            placeholder={placeholder}
            locale={{
              ...locale,
              lang: {
                ...locale.lang,
                now: t('now'),
                ok: t('ok')
              }
            }}
            {...dateProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledTime;

/**
 * @example Usage with React Hook Form
 *
 * ```jsx
 * import React from 'react';
 * import { useForm } from 'react-hook-form';
 * import AppHandledTime from './AppHandledTime'; // Assuming AppHandledTime is imported
 * import { format } from 'date-fns'; // Optional for formatting the time value

 * function MyForm() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   const handleSubmit = (data) => {
 *     console.log('Form data:', data);
 *     const formattedTime = format(data.meetingTime, 'HH:mm'); // Optional formatting
 *     console.log('Formatted time:', formattedTime);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <AppHandledTime
 *         label="Meeting Time"
 *         name="meetingTime"
 *         control={control}
 *         rules={{ required: true }}
 *         errors={errors}
 *         placeholder="Select time"
 *         dateProps={{ format: 'HH:mm' }} // Set time format (optional)
 *         onChangeApp={(time) => console.log('Time changed:', time)}
 *       />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */

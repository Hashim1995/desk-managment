import { Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { ColorPicker, ColorPickerProps, Form } from 'antd';

interface IAppHandledColorPicker {
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
  colorPickerProps?: ColorPickerProps;
}

function AppHandledColorPicker({
  label,
  name,
  control,
  rules,
  required,
  errors,
  onChangeApp,
  colorPickerProps
}: IAppHandledColorPicker) {
  return (
    <Form.Item
      label={label}
      // labelCol={{ span: 24, }}
      required={required}
      htmlFor={name}
      tooltip={errors[name] ? errors[name].message : ''}
      name={name}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <ColorPicker
            onChange={(e: any) => {
              onChange(e?.toHexString());
              onChangeApp && onChangeApp(e?.toHexString());
            }}
            value={value}
            defaultValue={value}
            showText
            {...colorPickerProps}
          />
        )}
      />
    </Form.Item>
  );
}

export default AppHandledColorPicker;

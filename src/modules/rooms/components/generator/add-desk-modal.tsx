import { Dispatch, SetStateAction, useId } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useReadLocalStorage } from 'usehooks-ts';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  selectPlaceholderText,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import AppHandledInput from '@/components/forms/input/handled-input';

import AppHandledButton from '@/components/display/button/handle-button';
import { IDesk } from '../../types';
import AppHandledColorPicker from '@/components/forms/color-picker/app-handed-color-picker';
import AppHandledSelect from '@/components/forms/select/handled-select';

interface IAddDeskProps {
  ownersCombo: { name: string; id: number }[];
  showAddDeskModal: boolean;
  setDeskList: Dispatch<SetStateAction<IDesk[]>>;
  setShowAddDeskModal: Dispatch<SetStateAction<boolean>>;
}

function AddDeskModal({
  setShowAddDeskModal,
  showAddDeskModal,
  setDeskList,
  ownersCombo
}: IAddDeskProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm<IDesk>({
    defaultValues: {
      clientId: useId(),
      name: '',
      positionX: 0,
      positionY: 0,
      width: '100',
      height: '100',
      opacity: 60,
      backgroundColor: '#16a34a'
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Desk modal.
        setShowAddDeskModal(false);
      }
    });
  };

  async function onSubmit(data: IDesk) {
    setDeskList((prev: IDesk[]) => [...prev, data]);
    setShowAddDeskModal(false);
  }

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={'Add'}
      open={showAddDeskModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-Desk-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {t('save')}
        </AppHandledButton>
      ]}
    >
      <Form
        id="add-Desk-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-3">
              <AppHandledInput
                label={'Name'}
                name="name"
                inputProps={{
                  id: 'name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Name')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText('Name')}
                errors={errors}
              />
              <AppHandledSelect
                label={'Owner'}
                name="ownerId"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Owner')
                  }
                }}
                required={false}
                control={control}
                placeholder={inputPlaceholderText('Owner')}
                errors={errors}
                selectProps={{
                  allowClear: true,
                  showSearch: true,
                  id: 'ownerId',
                  placeholder: selectPlaceholderText('Owner'),
                  className: 'w-full',
                  options:
                    ownersCombo?.map(z => ({ value: z?.id, label: z?.name })) ||
                    []
                }}
              />
              <AppHandledInput
                label={'Width'}
                name="width"
                inputProps={{
                  id: 'width'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Width')
                  },
                  min: {
                    value: 20,
                    message: minLengthCheck('Width', '20')
                  },
                  max: {
                    value: 200,
                    message: minLengthCheck('Width', '200')
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText('Width')}
                errors={errors}
              />
              <AppHandledInput
                label={'Height'}
                name="height"
                inputProps={{
                  id: 'height'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Height')
                  },
                  min: {
                    value: 20,
                    message: minLengthCheck('Height', '20')
                  },
                  max: {
                    value: 200,
                    message: minLengthCheck('Height', '200')
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText('Height')}
                errors={errors}
              />
              <AppHandledInput
                label={'Opacity'}
                name="opacity"
                inputProps={{
                  id: 'opacity'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Opacity')
                  },
                  min: {
                    value: 5,
                    message: minLengthCheck('Opacity', '5')
                  },
                  max: {
                    value: 100,
                    message: minLengthCheck('Opacity', '100')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText('Opacity')}
                errors={errors}
              />
              <AppHandledColorPicker
                label={'Opacity'}
                name="backgroundColor"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Opacity')
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText('Opacity')}
                errors={errors}
                colorPickerProps={{
                  format: 'hex',
                  disabledAlpha: false
                }}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddDeskModal;

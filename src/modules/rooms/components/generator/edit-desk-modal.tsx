import { Dispatch, SetStateAction, useEffect } from 'react';
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
// import AppHandledColorPicker from '@/components/forms/color-picker/app-handed-color-picker';
import AppHandledSelect from '@/components/forms/select/handled-select';

interface IEditDeskProps {
  ownersCombo: { name: string; id: number }[];
  showEditDeskModal: boolean;
  setDeskList: Dispatch<SetStateAction<IDesk[]>>;
  setShowEditDeskModal: Dispatch<SetStateAction<boolean>>;
  selectedDesk: IDesk;
}

function EditDeskModal({
  setShowEditDeskModal,
  showEditDeskModal,
  setDeskList,
  selectedDesk,
  ownersCombo
}: IEditDeskProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    setValue,
    handleSubmit
  } = useForm<IDesk>({
    defaultValues: {
      clientId: selectedDesk?.clientId,
      name: selectedDesk?.name,
      positionX: selectedDesk?.positionX,
      positionY: selectedDesk?.positionY,
      width: selectedDesk?.width,
      height: selectedDesk?.height,
      opacity: selectedDesk?.opacity,
      backgroundColor: selectedDesk?.backgroundColor
      // ownerId: ownersCombo?.find(z => z?.id === selectedDesk?.ownerId)
      //   ? {
      //       value: selectedDesk?.ownerId,
      //       label: ownersCombo.find(z => z?.id === selectedDesk?.ownerId)?.name
      //     }
      //   : null
    },

    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the Edit Desk modal.
        setShowEditDeskModal(false);
      }
    });
  };

  async function onSubmit(data: IDesk) {
    setDeskList((prev: IDesk[]) =>
      prev.map((z: IDesk) =>
        z.clientId === selectedDesk?.clientId ? { ...z, ...data } : z
      )
    );
    setShowEditDeskModal(false);
  }

  useEffect(() => {
    setValue(
      'ownerId',
      ownersCombo?.find(z => z?.id === selectedDesk?.ownerId)
        ? {
            value: selectedDesk?.ownerId,
            label: ownersCombo.find(z => z?.id === selectedDesk?.ownerId)?.name
          }
        : null
    );
  }, [selectedDesk]);
  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={t('edit')}
      open={showEditDeskModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="Edit-Desk-modal-form"
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
        id="Edit-Desk-modal-form"
        layout="vertical"
        className="EditPordductTabOneContainer"
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
                allowClear
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
              {/* <AppHandledColorPicker
                label={'Color'}
                name="backgroundColor"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Color')
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText('Color')}
                errors={errors}
                colorPickerProps={{
                  format: 'hex',
                  disabledAlpha: true
                }}
              /> */}
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditDeskModal;

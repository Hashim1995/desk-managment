import { Dispatch, SetStateAction } from 'react';
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
      backgroundColor: selectedDesk?.backgroundColor,
      ownerId: selectedDesk?.ownerId
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
                label={t('name')}
                name="name"
                inputProps={{
                  id: 'name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('name'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('name'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('width'))}
                errors={errors}
              />
              <AppHandledSelect
                label={t('owner')}
                name="ownerId"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('owner'))
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText(t('owner'))}
                errors={errors}
                selectProps={{
                  allowClear: true,
                  showSearch: true,
                  id: 'ownerId',
                  placeholder: selectPlaceholderText(t('owner')),
                  className: 'w-full',
                  options:
                    ownersCombo?.map(z => ({ value: z?.id, label: z?.name })) ||
                    []
                }}
              />
              <AppHandledInput
                label={t('width')}
                name="width"
                inputProps={{
                  id: 'width'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('width'))
                  },
                  min: {
                    value: 20,
                    message: minLengthCheck(t('width'), '20')
                  },
                  max: {
                    value: 200,
                    message: minLengthCheck(t('width'), '200')
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText(t('width'))}
                errors={errors}
              />
              <AppHandledInput
                label={t('height')}
                name="height"
                inputProps={{
                  id: 'height'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('height'))
                  },
                  min: {
                    value: 20,
                    message: minLengthCheck(t('height'), '20')
                  },
                  max: {
                    value: 200,
                    message: minLengthCheck(t('height'), '200')
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText(t('height'))}
                errors={errors}
              />
              <AppHandledInput
                label={t('opacity')}
                name="opacity"
                inputProps={{
                  id: 'opacity'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('opacity'))
                  },
                  min: {
                    value: 5,
                    message: minLengthCheck(t('opacity'), '5')
                  },
                  max: {
                    value: 100,
                    message: minLengthCheck(t('opacity'), '100')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('opacity'))}
                errors={errors}
              />
              <AppHandledColorPicker
                label={t('color')}
                name="backgroundColor"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('color'))
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText(t('color'))}
                errors={errors}
                colorPickerProps={{
                  format: 'hex',
                  disabledAlpha: true
                }}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditDeskModal;

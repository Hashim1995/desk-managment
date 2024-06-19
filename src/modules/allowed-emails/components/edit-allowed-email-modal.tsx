import { Dispatch, SetStateAction } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import { useForm } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';

import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IAllowedEmails, IAllowedEmailsUpdate } from '../types';
import { AllowedEmailsService } from '@/services/allowed-emails-services/allowed-emails-services';

interface IEditAllowedEmailProps {
  showEditAllowedEmailModal: boolean;
  setShowEditAllowedEmailModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  selectedItem: IAllowedEmails;
}

function EditAllowedEmailModal({
  setRefreshComponent,
  setShowEditAllowedEmailModal,
  showEditAllowedEmailModal,
  selectedItem
}: IEditAllowedEmailProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm<IAllowedEmailsUpdate>({
    defaultValues: {
      emailAddress: selectedItem?.emailAddress || '-'
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the edit AllowedEmail modal.
        setShowEditAllowedEmailModal(false);
      }
    });
  };

  async function onSubmit(data: IAllowedEmailsUpdate) {
    try {
      const res =
        await AllowedEmailsService.getInstance().updateAllowedEmailsMain({
          ...data,
          id: selectedItem?.allowedEmailId
        });
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowEditAllowedEmailModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={t('edit')}
      open={showEditAllowedEmailModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="edit-AllowedEmail-modal-form"
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
        id="edit-AllowedEmail-modal-form"
        layout="vertical"
        className="editPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-3">
              <AppHandledInput
                label={t('email')}
                name="emailAddress"
                inputProps={{
                  id: 'emailAddress'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('email'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('email'), '3')
                  }
                }}
                required
                control={control}
                inputType="email"
                placeholder={inputPlaceholderText(t('email'))}
                errors={errors}
              />
            </div>{' '}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditAllowedEmailModal;

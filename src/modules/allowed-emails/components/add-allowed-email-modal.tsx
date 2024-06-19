import { Dispatch, SetStateAction } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useReadLocalStorage } from 'usehooks-ts';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import AppHandledInput from '@/components/forms/input/handled-input';

import AppHandledButton from '@/components/display/button/handle-button';
import { IAllowedEmailsCreate } from '../types';
import { AllowedEmailsService } from '@/services/allowed-emails-services/allowed-emails-services';

interface IProps {
  showAddAllowedEmailModal: boolean;
  setShowAddAllowedEmailModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddAllowedEmailModal({
  setRefreshComponent,
  setShowAddAllowedEmailModal,
  showAddAllowedEmailModal
}: IProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm<IAllowedEmailsCreate>({
    defaultValues: {
      emailAddress: ''
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Staff modal.
        setShowAddAllowedEmailModal(false);
      }
    });
  };

  async function onSubmit(data: IAllowedEmailsCreate) {
    try {
      const res =
        await AllowedEmailsService.getInstance().createAllowedEmailsMain(data);
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowAddAllowedEmailModal(false);
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
      title={t('add')}
      open={showAddAllowedEmailModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-Staff-modal-form"
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
        id="add-Staff-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
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

export default AddAllowedEmailModal;

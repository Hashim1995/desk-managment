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
import { StaffService } from '@/services/staff-services/staff-services';

import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IStaff, IStaffChangePassword } from '../types';

interface IChangePasswordStaffProps {
  showChangePasswordStaffModal: boolean;
  setShowChangePasswordStaffModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  selectedItem: IStaff;
}

function ChangePasswordStaffModal({
  setRefreshComponent,
  setShowChangePasswordStaffModal,
  showChangePasswordStaffModal,
  selectedItem
}: IChangePasswordStaffProps) {
  const {
    formState: { errors, isSubmitting },
    control,

    handleSubmit
  } = useForm<IStaffChangePassword>({
    defaultValues: {
      newPassword: ''
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    console.log('aaa');
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the edit Staff modal.
        setShowChangePasswordStaffModal(false);
      }
    });
  };

  async function onSubmit(data: IStaffChangePassword) {
    try {
      const res = await StaffService.getInstance().changePasswordStaffMain({
        ...data,
        userId: selectedItem?.id
      });
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowChangePasswordStaffModal(false);
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
      open={showChangePasswordStaffModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="edit-Staff-modal-form"
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
        id="edit-Staff-modal-form"
        layout="vertical"
        className="editPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-3">
              <AppHandledInput
                label={t('newPassword')}
                name="newPassword"
                inputProps={{
                  id: 'newPassword'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('newPassword'))
                  },
                  minLength: {
                    value: 6,
                    message: minLengthCheck(t('newPassword'), '6')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('newPassword'))}
                errors={errors}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ChangePasswordStaffModal;

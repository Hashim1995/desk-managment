import { Dispatch, SetStateAction } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useReadLocalStorage } from 'usehooks-ts';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { StaffService } from '@/services/staff-services/staff-services';
import AppHandledInput from '@/components/forms/input/handled-input';

import AppHandledButton from '@/components/display/button/handle-button';
import AppFileUpload from '@/components/forms/file-upload';
import { IStaffCreate } from '../types';

interface IAddStaffProps {
  showAddStaffModal: boolean;
  setShowAddStaffModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddStaffModal({
  setRefreshComponent,
  setShowAddStaffModal,
  showAddStaffModal
}: IAddStaffProps) {
  const {
    setValue,
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm<IStaffCreate>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: ''
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
        // If the user confirms closing, hide the add Staff modal.
        setShowAddStaffModal(false);
      }
    });
  };

  async function onSubmit(data: IStaffCreate) {
    try {
      const res = await StaffService.getInstance().createStaffMain(data);
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowAddStaffModal(false);
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
      open={showAddStaffModal}
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
                label={t('firstName')}
                name="firstName"
                inputProps={{
                  id: 'firstName'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('firstName'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('firstName'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('firstName'))}
                errors={errors}
              />
            </div>
            <div className="pb-3">
              <AppHandledInput
                label={t('lastName')}
                name="lastName"
                inputProps={{
                  id: 'lastName'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('lastName'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('lastName'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('lastName'))}
                errors={errors}
              />
            </div>{' '}
            <div className="pb-3">
              <AppHandledInput
                label={t('email')}
                name="email"
                inputProps={{
                  id: 'email'
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
            <div className="pb-3">
              <AppHandledInput
                label={t('phoneNumber')}
                name="phoneNumber"
                inputProps={{
                  id: 'phoneNumber'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('phoneNumber'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('phoneNumber'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('phoneNumber'))}
                errors={errors}
              />
            </div>
            <div className="pb-3">
              <AppHandledInput
                label={t('password')}
                name="password"
                inputProps={{
                  id: 'password'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('password'))
                  },
                  minLength: {
                    value: 6,
                    message: minLengthCheck(t('password'), '6')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('password'))}
                errors={errors}
              />
            </div>
          </Col>
          <Form.Item className="uploadIcon" label={t('userPhoto')}>
            <AppFileUpload
              listType="text"
              loadingText={t('uploading')}
              accept=".jpg, .png, .jpeg, .webp"
              isProfile
              length={1}
              getValues={(e: UploadFile[]) => {
                console.log(e, 'test');

                if (e && e.length > 0) {
                  const selectedFile = e[0];
                  const fileData = selectedFile?.response?.id;
                  fileData && setValue('photoFileId', fileData);
                } else {
                  setValue('photoFileId', null);
                }
              }}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddStaffModal;

import { Dispatch, SetStateAction } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';

import { StaffService } from '@/services/staff-services/staff-services';
import AppHandledButton from '@/components/display/button/handle-button';
import AppFileUpload from '@/components/forms/file-upload';
import TokenizedImage from '@/components/display/image';
import AppHandledInput from '@/components/forms/input/handled-input';
import { IStaff, IStaffUpdate } from '../types';

interface IEditStaffProps {
  showEditStaffModal: boolean;
  setShowEditStaffModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  selectedItem: IStaff;
}

function EditStaffModal({
  setRefreshComponent,
  setShowEditStaffModal,
  showEditStaffModal,
  selectedItem
}: IEditStaffProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    setValue,
    watch,
    handleSubmit
  } = useForm<IStaffUpdate>({
    defaultValues: {
      firstName: selectedItem?.firstName || '-',
      lastName: selectedItem?.lastName || '-',
      email: selectedItem?.email || '-',
      phoneNumber: selectedItem?.phoneNumber || '-',
      photoFileId: selectedItem?.photoFileId || null
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
        setShowEditStaffModal(false);
      }
    });
  };

  async function onSubmit(data: IStaffUpdate) {
    try {
      const res = await StaffService.getInstance().updateStaffMain({
        ...data,
        id: selectedItem?.id
      });
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowEditStaffModal(false);
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
      open={showEditStaffModal}
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
            {selectedItem?.photoFileId ? (
              <>
                <p className="">Current photo:</p>
                <div className="relative w-[200px]">
                  <TokenizedImage
                    useCach
                    tokenized
                    imgType="avatar"
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: 'contain'
                    }}
                    src={String(watch('photoFileId')) || ''}
                  />
                  <AppHandledButton
                    className="-top-0 -right-1 absolute"
                    onClick={() => {
                      setValue('photoFileId', null);
                    }}
                    danger
                    icon={<BiTrash />}
                  />
                </div>
              </>
            ) : null}
          </Col>
          <Form.Item className="mt-2 uploadIcon" label={t('userPhoto')}>
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
                }
              }}
            />
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditStaffModal;

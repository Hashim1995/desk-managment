import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
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
import { StaffService } from '@/services/staff-services/staff-services';
import AppHandledInput from '@/components/forms/input/handled-input';

import AppHandledButton from '@/components/display/button/handle-button';
import AppFileUpload from '@/components/forms/file-upload';
import { IStaffCreate } from '../types';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { RoomsService } from '@/services/rooms-services/rooms-services';

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
  const [desksList, setDesksList] = useState<{ name: string; id: number }[]>(
    []
  );
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
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Staff modal.
        setShowAddStaffModal(false);
      }
    });
  };

  async function onSubmit(data: IStaffCreate) {
    const payload = {
      ...data,
      ownedDesks: data?.ownedDesks?.map((z: any) => ({ id: z })) || null
    };
    try {
      const res = await StaffService.getInstance().createStaffMain(payload);
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowAddStaffModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getLists() {
    try {
      const res = await RoomsService.getInstance().getDesksComboList();
      if (res) {
        setDesksList(res);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getLists();
  }, []);

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
                label={'First name'}
                name="firstName"
                inputProps={{
                  id: 'firstName'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('First name')
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck('First name', '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText('First name')}
                errors={errors}
              />
            </div>
            <div className="pb-3">
              <AppHandledInput
                label={'Last name'}
                name="lastName"
                inputProps={{
                  id: 'lastName'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Last name')
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck('Last name', '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText('Last name')}
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
              <AppHandledSelect
                label={'Desk name'}
                name="ownedDesks"
                rules={{
                  required: {
                    value: false,
                    message: inputValidationText('Owner')
                  }
                }}
                control={control}
                placeholder={inputPlaceholderText('Desk name')}
                errors={errors}
                selectProps={{
                  showSearch: true,
                  id: 'ownedDesks',
                  mode: 'multiple',
                  placeholder: selectPlaceholderText('Desk name'),
                  className: 'w-full',
                  options:
                    desksList?.map(z => ({
                      value: z?.id,
                      label: z?.name
                    })) || []
                }}
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

import { Dispatch, SetStateAction } from 'react';
import { Alert, Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';
import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';
import AppHandledButton from '@/components/display/button/handle-button';
import { t } from 'i18next';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppFileUpload from '@/components/forms/file-upload';
import { IRoomsCreate } from '../types';

interface IAddRoomProps {
  showAddRoomModal: boolean;
  setShowAddRoomModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddRoomModal({
  setRefreshComponent,
  setShowAddRoomModal,
  showAddRoomModal
}: IAddRoomProps) {
  const {
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    setValue
  } = useForm<IRoomsCreate>({
    defaultValues: {
      name: ''
    },
    mode: 'onChange'
  });

  const darkMode = useReadLocalStorage('darkTheme');

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Room modal.
        setShowAddRoomModal(false);
      }
    });
  };

  async function onSubmit(data: IRoomsCreate) {
    try {
      const res = await RoomsService.getInstance().createRoomsMain(data);
      if (res?.id) {
        setRefreshComponent(z => !z);
        setShowAddRoomModal(false);
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
      open={showAddRoomModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-Room-modal-form"
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
        id="add-Room-modal-form"
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
                  id: 'Name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Name')
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck('Name', '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText('Name')}
                errors={errors}
              />
            </div>

            <div className="pb-3">
              <Form.Item className="uploadIcon" label={'Room photo'}>
                <AppFileUpload
                  listType="text"
                  loadingText={t('uploading')}
                  accept=".jpg, .png, .jpeg, .webp, .svg"
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
            </div>
            <Alert
              message="Upload photo sizes must be (width: 1000px, height: 1000px)"
              type="warning"
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddRoomModal;

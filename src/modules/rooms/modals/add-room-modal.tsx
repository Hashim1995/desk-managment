/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction, useState } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { languagesOptions } from '@/utils/constants/options';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled_input';
import { useTranslation } from 'react-i18next';
import AppFileUploadNew from '@/components/forms/file-upload/file-upload';

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
    formState: { errors },
    control,
    handleSubmit,
    setValue
  } = useForm<any>({
    defaultValues: {
      name: '',
      author: '',
      description: '',
      price: null,
      coverPhoto: '',
      audioFile: null,
      pdfFile: null,
      showOnFirstScreen: false,
      language: languagesOptions[0]
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClose = () => {
    console.log('aaa');
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Room modal.
        setShowAddRoomModal(false);
      }
    });
  };

  const onSubmit = (data: any) => console.log(data);

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
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
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
                label={t('name')}
                name="name"
                inputProps={{
                  id: 'Name'
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
                placeholder={inputPlaceholderText(t('name'))}
                errors={errors}
              />
            </div>

            <div className="pb-3">
              <Form.Item label={t('roomBackgroundPhoto')}>
                <AppFileUploadNew
                  setFileList={setFileList}
                  fileList={fileList}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddRoomModal;

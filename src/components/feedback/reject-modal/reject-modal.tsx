import React, { Dispatch, SetStateAction, useState } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';
import { EdcServies } from '@/services/edc-services/edc-services';
import { RejectMessage } from '@/modules/rooms/models';
import { useNavigate } from 'react-router-dom';
import AppHandledButton from '@/components/display/button/handle-button';
import AppFileUpload from '@/components/forms/file-upload/file-upload';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { toastOptions } from '@/configs/global-configs';
import { useTranslation } from 'react-i18next';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck
} from '@/utils/functions/functions';
import { toast } from 'react-toastify';

interface FormData {
  Message: string | null;
  fileId: number | string | null;
}

interface RejectModalProps {
  id: number | undefined;
  showRejectForm: boolean;
  setShowRejectForm: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
}
function RejectModal({
  id,
  showRejectForm,
  setRefreshComponent,
  setShowRejectForm
}: RejectModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      Message: null,
      fileId: null
    }
  });
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (data: RejectMessage) => {
    setBtnLoader(true);

    if (id) {
      const res = await EdcServies.getInstance().rejectDoc(
        id,
        {
          Message: data.Message,
          fileId: data?.fileId
        },
        () => setBtnLoader(false)
      );

      if (res.isSuccess) {
        toast.success(res.Data?.message, toastOptions);
        setShowRejectForm && setShowRejectForm(false);
        setRefreshComponent && setRefreshComponent(z => !z);

        setBtnLoader(false);
        reset();
        navigate('/edc');
      }
    }
  };

  return (
    <Modal
      width={700}
      destroyOnClose
      title={t('rejectionReason')}
      open={showRejectForm}
      onCancel={() => {
        setShowRejectForm(false);
        reset();
      }}
      okText={t('send')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="Message-form"
          type="primary"
          loading={btnLoader}
          key="submit"
          htmlType="submit"
        >
          {t('send')}
        </AppHandledButton>
      ]}
    >
      <Form
        onFinish={handleSubmit(onSubmit)}
        id="Message-form"
        layout="vertical"
        className="editForm"
      >
        <Row gutter={16}>
          <Col className="mb-10 gutter-row" span={24}>
            <AppHandledTextArea
              label={t('reason')}
              name="Message"
              control={control}
              placeholder={inputPlaceholderText(t('rejectionReason'))}
              errors={errors}
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(t('rejectionReason'))
                },
                minLength: {
                  value: 5,
                  message: minLengthCheck(t('rejectionReason'), '7')
                }
              }}
              required
              formItemProps={{
                labelAlign: 'left',
                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                style: { fontWeight: 'bolder' }
              }}
              textareaProps={{
                size: 'large',
                row: 112
              }}
            />
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item className="uploadIcon" label={t('fileUpload')}>
              <AppFileUpload
                listType="text"
                accept=".pdf"
                isProfile
                length={1}
                getValues={(e: UploadFile[]) => {
                  if (e && e.length > 0) {
                    const selectedFile = e[0];
                    const fileData = selectedFile?.response?.Data;
                    fileData && setValue('fileId', fileData?.id);
                  } else {
                    setValue('fileId', null);
                  }
                }}
                folderType={1}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default RejectModal;

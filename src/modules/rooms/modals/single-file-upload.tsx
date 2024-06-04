/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import AppFileUpload from '@/components/forms/file-upload/file-upload';
import { toastOptions } from '@/configs/global-configs';
import { FolderTypes } from '@/models/common';
import { inputValidationText } from '@/utils/functions/functions';
import { Col, Form, Row, UploadFile } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, UseFormSetValue, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { IEdcAdditionFileUploadModalForm } from '../models';

type IEdcFileUploadProps = {
  globalSetvalue: UseFormSetValue<any>;
  setShowUploadFileModal: Dispatch<SetStateAction<boolean>>;
};

function SingleFileUpload({
  globalSetvalue,
  setShowUploadFileModal
}: IEdcFileUploadProps) {
  const { watch, handleSubmit, setValue } =
    useForm<IEdcAdditionFileUploadModalForm>({
      mode: 'onChange'
    });

  const { t } = useTranslation();
  const onSubmit: SubmitHandler<IEdcAdditionFileUploadModalForm> = async (
    data: IEdcAdditionFileUploadModalForm
  ) => {
    if (!watch('fileList')) {
      toast.error(inputValidationText(t('doc')), toastOptions);
      return;
    }
    if (data?.fileList && 'id' in data.fileList) {
      globalSetvalue('tableFileList', [
        {
          ...data.fileList
        }
      ]);
    }

    setShowUploadFileModal(false);
  };

  return (
    <div>
      <Form
        onFinish={handleSubmit(onSubmit)}
        id="file-upload-modal-form"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={24}>
            <AppFileUpload
              listType="picture-card"
              accept=".pdf, .doc, .docx"
              length={1}
              getValues={(e: Array<UploadFile>) => {
                if (e && e.length > 0) {
                  setValue('fileList', e[0]?.response?.Data);
                }
              }}
              folderType={FolderTypes.ContractMainFile}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default SingleFileUpload;

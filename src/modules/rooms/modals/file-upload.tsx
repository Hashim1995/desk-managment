/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import { fileTypeOptions } from '@/utils/constants/options';

import { Col, Form, Row, UploadFile } from 'antd';
import {
  SubmitHandler,
  UseFormSetValue,
  UseFormWatch,
  useForm
} from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { FolderTypes } from '@/models/common';
import {
  inputPlaceholderText,
  inputValidationText,
  selectPlaceholderText
} from '@/utils/functions/functions';
import AppFileUpload from '@/components/forms/file-upload/file-upload';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { toastOptions } from '@/configs/global-configs';
import { useTranslation } from 'react-i18next';
import { IEdcContractForm, IEdcContractFileUploadModalForm } from '../models';

type IEdcCreateContractFileUploadProps = {
  globalSetvalue: UseFormSetValue<IEdcContractForm>;
  globalWatch: UseFormWatch<IEdcContractForm>;
  setShowUploadFileModal: Dispatch<SetStateAction<boolean>>;
};

function FileUpload({
  globalSetvalue,
  globalWatch,
  setShowUploadFileModal
}: IEdcCreateContractFileUploadProps) {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IEdcContractFileUploadModalForm>({
    mode: 'onChange',
    defaultValues: {
      fileType: null
    }
  });

  const { t } = useTranslation();

  const onSubmit: SubmitHandler<IEdcContractFileUploadModalForm> = async (
    data: IEdcContractFileUploadModalForm
  ) => {
    if (!watch('fileList')) {
      toast.error(inputValidationText(t('doc')), toastOptions);
      return;
    }
    if (data?.fileList && 'id' in data.fileList) {
      globalSetvalue('tableFileList', [
        ...globalWatch('tableFileList'),
        {
          ...data.fileList,
          type: Number(data.fileType)
        }
      ]);
    }

    setShowUploadFileModal(false);

    setShowUploadFileModal(false);
  };

  const filteredOptions = () => {
    const selectedValues: number[] = (
      globalWatch('tableFileList')?.map(z => z?.type) || []
    ).filter(Boolean) as number[];
    const res = fileTypeOptions?.filter(
      z => typeof z?.value === 'number' && !selectedValues.includes(z?.value)
    );
    return res;
  };

  return (
    <div>
      <Form
        onFinish={handleSubmit(onSubmit)}
        id="file-upload-modal-form"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <AppHandledSelect
              label={t('fileType')}
              name="fileType"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(t('fileType'))
                }
              }}
              required
              placeholder={inputPlaceholderText(t('fileType'))}
              errors={errors}
              selectProps={{
                showSearch: true,
                id: 'fileType',
                placeholder: selectPlaceholderText(t('fileType')),
                className: 'w-full',
                options: filteredOptions(),
                size: 'large'
              }}
              formItemProps={{
                labelAlign: 'left',
                labelCol: { span: 8 },
                style: { fontWeight: 'bolder' }
              }}
            />
          </Col>
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

export default FileUpload;

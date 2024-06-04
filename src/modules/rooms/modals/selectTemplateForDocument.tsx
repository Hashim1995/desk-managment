import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import { useForm } from 'react-hook-form';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { toastOptions } from '@/configs/global-configs';
import { EdcServies } from '@/services/edc-services/edc-services';
import {
  inputValidationText,
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/functions/functions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  IGetTemplatesListResponse,
  SelectTemplatesForDocument
} from '../models';

interface FormData {
  documentApprovalCycleId: number | null;
}

interface SelectTemplatesForDocumentProps {
  id: number | undefined;
  showSelectTemplatesForDocumentForm: boolean;
  setShowSelectTemplatesForDocumentForm: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
}
function SelectTemplateForDocument({
  id,
  showSelectTemplatesForDocumentForm,
  setRefreshComponent,
  setShowSelectTemplatesForDocumentForm
}: SelectTemplatesForDocumentProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      documentApprovalCycleId: null
    }
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [templatesListLoading, setTemplatesListLoading] =
    useState<boolean>(false);
  const [templatesList, setTemplatesList] =
    useState<IGetTemplatesListResponse>();

  const fetchTemplatesList = async () => {
    setTemplatesListLoading(true);
    const res: IGetTemplatesListResponse =
      await EdcServies.getInstance().getTemplatesList();
    setTemplatesList(res);
    setTemplatesListLoading(false);
  };

  const onSubmit = async (data: SelectTemplatesForDocument) => {
    setBtnLoader(true);

    if (id) {
      const res = await EdcServies.getInstance().selectTemplateForDocument(
        {
          documentId: id,
          documentApprovalCycleId: data.documentApprovalCycleId
        },
        () => setBtnLoader(false)
      );

      if (res.isSuccess) {
        toast.success(res.Data?.message, toastOptions);
        setShowSelectTemplatesForDocumentForm &&
          setShowSelectTemplatesForDocumentForm(false);
        setRefreshComponent && setRefreshComponent(z => !z);

        setBtnLoader(false);
        navigate('/edc');
        reset();
      }
    }
  };

  useEffect(() => {
    fetchTemplatesList();
  }, []);

  return (
    <Modal
      width={700}
      destroyOnClose
      title={t('template')}
      open={showSelectTemplatesForDocumentForm}
      onCancel={() => {
        setShowSelectTemplatesForDocumentForm(false);
        reset();
      }}
      okText={t('send')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="documentApprovalCycleId-form"
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
        id="documentApprovalCycleId-form"
        layout="vertical"
        className="editForm"
      >
        <Row gutter={16}>
          <Col className="gutter-row mb-10" span={24}>
            <AppHandledSelect
              label={t('templateName')}
              name="documentApprovalCycleId"
              control={control}
              required
              rules={{
                required: {
                  value: true,
                  message: inputValidationText(t('templateName'))
                }
              }}
              placeholder={inputPlaceholderText(t('templateName'))}
              getLabelOnChange
              errors={errors}
              selectProps={{
                loading: templatesListLoading,
                disabled: templatesListLoading,
                showSearch: true,
                id: 'documentApprovalCycleId',
                placeholder: selectPlaceholderText(t('templateName')),
                className: 'w-full',
                options: templatesList?.Data?.Datas || [],
                size: 'large'
              }}
              formItemProps={{
                labelAlign: 'left',
                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                style: { fontWeight: 'bolder' }
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default SelectTemplateForDocument;

/* eslint-disable no-unused-vars */
// Ant Design components
import {
  Breadcrumb,
  Card,
  Col,
  Form,
  Row,
  Space,
  Tooltip,
  UploadFile
} from 'antd';

// Ant Design icons
import { HomeOutlined, CloseOutlined } from '@ant-design/icons';

// React and related libraries
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Constants
import AppHandledButton from '@/components/display/button/handle-button';

import { t } from 'i18next';
import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck
} from '@/utils/functions/functions';
import AppHandledInput from '@/components/forms/input/handled_input';
import { useState } from 'react';
import AppFileUploadNew from '@/components/forms/file-upload/file-upload';

function CreateRoom() {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors }
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      SenderLegalEntityVoen: '',
      SenderLegalEntityName: '',
      RecieverLegalEntityVoen: '',
      RecieverLegalEntityName: '',
      ProssesType: null,
      DocumentApprovalCycleId: null,
      StartDate: '',
      ExpireDate: '',
      RenewalDate: '',
      Description: '',
      tableFileList: []
    }
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <div>
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" gutter={[24, 24]} align="middle">
          <Col>
            <Space>
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link to="/home">
                        <HomeOutlined rev={undefined} />
                      </Link>
                    )
                  },

                  {
                    title: <Link to="/rooms">{t('rooms')}</Link>
                  },
                  {
                    title: t('create')
                  }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title={t('navigateToBack')}>
                <AppHandledButton type="default">
                  <Space>
                    <CloseOutlined rev={undefined} />
                  </Space>
                </AppHandledButton>
              </Tooltip>

              <AppHandledButton
                onClick={() => {
                  // if (Object.keys(errors).length !== 0) {
                  //   setActiveKeys(['1', '2', '3', '4']);
                  // }
                }}
                form="create-contract-form"
                htmlType="submit"
                type="primary"
              >
                <Space>{t('send')}</Space>
              </AppHandledButton>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card size="small" className="box box-margin-y">
        <Form
          id="add-book-modal-form"
          layout="vertical"
          className="addPordductTabOneContainer"
          onFinish={handleSubmit(onSubmit)}
        >
          <Row gutter={16}>
            <Col span={24}>
              <div className="pb-10">
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

              <div className="pb-10">
                <Form.Item label={t('coverPhoto')}>
                  <AppFileUploadNew
                    setFileList={setFileList}
                    fileList={fileList}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        salam
      </Card>
    </div>
  );
}

export default CreateRoom;

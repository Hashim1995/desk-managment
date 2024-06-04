/* eslint-disable no-unused-vars */
// Ant Design components
import { Breadcrumb, Card, Col, Row, Space, Tooltip } from 'antd';

// Ant Design icons
import { HomeOutlined, CloseOutlined } from '@ant-design/icons';

// React and related libraries
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Constants
import AppHandledButton from '@/components/display/button/handle-button';

import { t } from 'i18next';

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
        salam
      </Card>
    </div>
  );
}

export default CreateRoom;

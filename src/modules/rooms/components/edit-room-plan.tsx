// Ant Design components
import { Breadcrumb, Card, Col, Row, Space, Tooltip } from 'antd';

// Ant Design icons
import { HomeOutlined, CloseOutlined } from '@ant-design/icons';

// React and related libraries
import { Link, useLocation } from 'react-router-dom';

// Constants
import AppHandledButton from '@/components/display/button/handle-button';

import { t } from 'i18next';
import { tokenizeImage } from '@/utils/functions/functions';
import { useEffect, useState } from 'react';
import GridCanvas from './generator/GridCanvas';

function EditRoomPlan() {
  const [photoUrl, setPhotoUrl] = useState<{ fileUrl: string; url: string }>();

  const location = useLocation();

  const fetchTokenizedImage = async (id: string) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${id}`
      });
      setPhotoUrl(tokenizedFile);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location?.search);

    fetchTokenizedImage(query.get('photoFileId') || '');
  }, [location]);

  return (
    <div>
      <Card size="small" className="mb-4 box">
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
      <Card size="small" className="mb-4 box">
        <GridCanvas photoUrl={photoUrl!} />
      </Card>
    </div>
  );
}

export default EditRoomPlan;

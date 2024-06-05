/* eslint-disable no-unused-vars */
// Ant Design components
import {
  Breadcrumb,
  Button,
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
import { useState } from 'react';
import GridCanvas from './generator/GridCanvas';

function EditRoomPlan() {
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
        <GridCanvas />
      </Card>
    </div>
  );
}

export default EditRoomPlan;

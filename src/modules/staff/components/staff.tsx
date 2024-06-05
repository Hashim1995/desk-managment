/* eslint-disable no-use-before-define */
import AppHandledButton from '@/components/display/button/handle-button';
import { HomeOutlined, FileAddOutlined, MoreOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Space,
  Breadcrumb,
  Spin,
  Typography,
  Table,
  Dropdown,
  MenuProps,
  Modal
} from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toastOptions } from '@/configs/global-configs';
import { toast } from 'react-toastify';
import { StaffService } from '@/services/staff-services/staff-services';
import AppEmpty from '@/components/display/empty';
import TokenizedImage from '@/components/display/image';
import { deepClone } from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { IStaff } from '../types';
import AddStaffModal from './add-staff-modal';
import EditStaffModal from './edit-staff-modal';
import ChangePasswordStaffModal from './change-password-staff-modal';

export default function Staff() {
  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [selectedItem, setSelectedItem] = useState<IStaff>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState<boolean>(false);
  const [showChangePasswordStaffModal, setShowChangePasswordStaffModal] =
    useState<boolean>(false);
  const [showDeleteStaffModal, setShowDeleteStaffModal] =
    useState<boolean>(false);

  const columns: ColumnsType<IStaff> = [
    {
      title: t('userPhoto'),
      dataIndex: 'photoFileId',
      key: (Math.random() + 1).toString(12).substring(7),
      render: record => (
        <TokenizedImage
          useCach
          tokenized
          imgType="avatar"
          circle
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'unset'
          }}
          src={record ?? null}
        />
      )
    },
    {
      title: t('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('lastName'),
      dataIndex: 'lastName',
      key: 'lastName',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('phoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: record => renderEllipsisText(record)
    },
    {
      title: '',
      key: 'actions',
      align: 'end',
      width: 0,
      render: (_, raw: IStaff) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => {
                if (e?.key === '0') {
                  setShowEditStaffModal(true);
                  setSelectedItem(raw);
                }
                if (e?.key === '1') {
                  setSelectedItem(raw);
                  setShowDeleteStaffModal(true);
                }
                if (e?.key === '2') {
                  setSelectedItem(raw);
                  setShowChangePasswordStaffModal(true);
                }
              }
            }}
            key={raw?.id}
            trigger={['click']}
          >
            <AppHandledButton icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];
  const items: MenuProps['items'] = [
    {
      label: <Typography.Text>{t('editBtn')}</Typography.Text>,
      key: '0'
    },

    {
      label: <Typography.Text>{t('delete')}</Typography.Text>,
      key: '1'
    },
    {
      label: <Typography.Text>{t('changePassword')}</Typography.Text>,
      key: '2'
    }
  ];

  async function fetchStaffList() {
    setLoading(true);
    try {
      const res = await StaffService.getInstance().getStaffList();
      setStaffList(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchStaffList();
  }, [refreshComponent]);

  const deleteUser = async (id: number) => {
    const res = await StaffService.getInstance().delete(id);
    if (res) {
      toast.success(res.Data?.Message, toastOptions);
      setRefreshComponent(z => !z);
      setShowDeleteStaffModal(false);
    }
  };

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
                    title: t('rooms')
                  }
                ]}
              />
            </Space>
          </Col>

          <Col>
            <Space>
              <div>
                <AppHandledButton
                  onClick={() => {
                    setShowAddStaffModal(true);
                  }}
                  type="primary"
                >
                  <Space>
                    <FileAddOutlined rev={undefined} />
                    {t('addBtn')}
                  </Space>
                </AppHandledButton>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card>
        {staffList?.length ? (
          <Spin size="large" spinning={loading}>
            <Row className="pb-10">
              <Col span={24}>
                <Table
                  columns={columns}
                  pagination={false}
                  locale={{
                    emptyText: <AppEmpty />
                  }}
                  dataSource={deepClone(staffList)}
                />
              </Col>
            </Row>
          </Spin>
        ) : (
          <Spin size="large" spinning={loading}>
            <AppEmpty />
          </Spin>
        )}
      </Card>
      {showAddStaffModal && (
        <AddStaffModal
          setShowAddStaffModal={setShowAddStaffModal}
          setRefreshComponent={setRefreshComponent}
          showAddStaffModal={showAddStaffModal}
        />
      )}
      {showEditStaffModal && (
        <EditStaffModal
          setShowEditStaffModal={setShowEditStaffModal}
          setRefreshComponent={setRefreshComponent}
          showEditStaffModal={showEditStaffModal}
          selectedItem={selectedItem!}
        />
      )}
      {showChangePasswordStaffModal && (
        <ChangePasswordStaffModal
          setShowChangePasswordStaffModal={setShowChangePasswordStaffModal}
          setRefreshComponent={setRefreshComponent}
          showChangePasswordStaffModal={showChangePasswordStaffModal}
          selectedItem={selectedItem!}
        />
      )}
      <Modal
        title={t('confirmTitle')}
        open={showDeleteStaffModal}
        onOk={() => {
          deleteUser(selectedItem?.id || 0);
        }}
        onCancel={() => setShowDeleteStaffModal(false)}
        okText={t('yesTxt')}
        okType="danger"
        cancelText={t('noTxt')}
      >
        <p>{t('confirmDelete')}</p>
      </Modal>
    </div>
  );
}

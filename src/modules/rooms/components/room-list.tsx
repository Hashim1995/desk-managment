/* eslint-disable no-use-before-define */
import {
  Breadcrumb,
  Typography,
  Space,
  Col,
  Row,
  Card,
  Spin,
  MenuProps,
  Dropdown
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, FileAddOutlined, MoreOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { toastOptions } from '@/configs/global-configs';
import AppHandledButton from '@/components/display/button/handle-button';
import { useTranslation } from 'react-i18next';
import Table, { ColumnsType } from 'antd/es/table';

import AppEmpty from '@/components/display/empty';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal';
import TokenizedImage from '@/components/display/image';
import AddRoomModal from '../modals/add-room-modal';
import { IRooms } from '../types';
import { useDispatch } from 'react-redux';
import { setCurrentRoom } from '@/redux/rooms/rooms-slice';

function RoomList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const [roomListData, setRoomListData] = useState<IRooms[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedItem, setSelectedItem] = useState<IRooms>();
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  // Fetch the Room list data from the server
  const fetchRoomList = async () => {
    setLoading(true);

    try {
      const res: any = await RoomsService.getInstance().getRoomsList();

      setRoomListData(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnsType<IRooms> = [
    {
      title: t('photo'),
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
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: record => renderEllipsisText(record)
    },

    {
      title: '',
      key: 'actions',
      align: 'end',
      width: 0,
      render: (_, raw: IRooms) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => {
                if (e?.key === '0') {
                  // setShowEditStaffModal(true);
                  dispatch(setCurrentRoom(raw));
                  navigate(`/rooms/edit-room-plan/${raw?.roomId}`);
                  setSelectedItem(raw);
                }
                if (e?.key === '1') {
                  setSelectedItem(raw);
                  setModalVisible(true);
                }
                if (e?.key === '2') {
                  setSelectedItem(raw);
                  // setShowChangePasswordStaffModal(true);
                }
              }
            }}
            key={raw?.roomId}
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
    }
  ];

  const onCloseModal = () => {
    setModalVisible(false);
  };

  // Delete document
  const deleteDocument = async () => {
    if (selectedItem) {
      await RoomsService.getInstance().delete(selectedItem.roomId);
      toast.success(t('successTxt'), toastOptions);
      setModalVisible(false);
    }
    setRefreshComponent(z => !z);
  };

  // Confirm delete
  const onConfirmDelete = () => {
    deleteDocument();
  };

  // useEffect to fetch Room list data on component mount and when dependencies change
  useEffect(() => {
    fetchRoomList();
  }, [refreshComponent]);

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
                    setShowAddRoomModal(true);
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
      <Card className="box">
        {roomListData?.length ? (
          <Spin size="large" spinning={loading}>
            <Table
              columns={columns}
              dataSource={roomListData}
              // currentPage={page}
              // totalPage={20}
              // onChangePage={(e: number) => setCurrentPage(e)}
              key={forceUpdate.current}
              rowKey="id"
            />
          </Spin>
        ) : (
          <Spin size="large" spinning={loading}>
            <AppEmpty />
          </Spin>
        )}
      </Card>
      <DeleteConfirmationModal
        onCancel={onCloseModal}
        onOk={onConfirmDelete}
        visible={modalVisible}
      />
      {showAddRoomModal && (
        <AddRoomModal
          setShowAddRoomModal={setShowAddRoomModal}
          setRefreshComponent={setRefreshComponent}
          showAddRoomModal={showAddRoomModal}
        />
      )}
    </div>
  );
}

export default RoomList;

/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Breadcrumb,
  Typography,
  Space,
  Col,
  Row,
  Form,
  Collapse,
  Tooltip,
  Card,
  theme,
  Spin,
  Switch,
  MenuProps,
  Dropdown
} from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  FileAddOutlined,
  MoreOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { IHTTPSParams } from '@/services/adapter-config/config';
import {
  convertFormDataToQueryParams,
  getLanguageName,
  inputPlaceholderText
} from '@/utils/functions/functions';
import AppPagination from '@/components/display/pagination/pagination';

import { toast } from 'react-toastify';

import { toastOptions } from '@/configs/global-configs';
import AppHandledButton from '@/components/display/button/handle-button';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal/delete-confirmation-modal';
import AppEmpty from '@/components/display/empty/app-empty';
import AppHandledInput from '@/components/forms/input/handled_input';
import { useTranslation } from 'react-i18next';
import { EdcServies } from '@/services/edc-services/edc-services';
import { ColumnsType } from 'antd/es/table';
import AppHandledTable from '@/components/display/table/table';

import AddRoomModal from '../modals/add-room-modal';

function RoomList() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      DocumentCode: '',
      SenderLegalEntityId: '',
      SenderLegalEntityVoen: '',
      RecieverLegalEntityId: '',
      RecieverLegalEntityVoen: '',
      StartDateRange: '',
      CreatedDateRange: '',
      ExpireDateRange: '',
      DocumentTypeId: null,
      DocumentStatusId: null,
      status: null
    }
  });

  const { t } = useTranslation();

  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const [RoomListData, setRoomListData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Partial<any> | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);
  const forceUpdate = useRef<number>(0);

  const { Text } = Typography;
  const { useToken } = theme;
  const navigate = useNavigate();
  const { token } = useToken();

  // Fetch the Room list data from the server
  const fetchRoomList = async () => {
    setLoading(true);

    try {
      const res: any = await EdcServies.getInstance().getEdcList([
        ...queryParams,
        { name: 'page', value: page }
      ]);

      if (res.isSuccess) {
        setRoomListData(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fakeData = [
    {
      name: 'Room 1',
      backgroundImage: '',
      status: true,
      id: 1
    }
  ];

  const columns: ColumnsType<any> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('status'),
      dataIndex: 'isActive',
      align: 'end',

      key: 'isActive',
      render: (record: boolean, raw: any) => (
        <Tooltip placement="top" title="Statusu dəyiş">
          <Switch checked={record} onChange={() => console.log(raw?.id)} />
        </Tooltip>
      )
    },
    {
      title: '',
      key: 'actions',
      align: 'end',
      width: 0,
      render: (_, raw: any) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => {
                if (e?.key === '0') {
                  navigate(`edit-room-plan/${raw?.id}`);
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
      label: <Typography.Text>{t('view')}</Typography.Text>,
      key: '1'
    },
    {
      label: <Typography.Text>{t('delete')}</Typography.Text>,
      key: '2'
    }
  ];

  const onCloseModal = () => {
    setModalVisible(false);
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    setCurrentPage(1);

    const dates = {
      StartDateMin: Array.isArray(data?.StartDateRange)
        ? data?.StartDateRange[0]
        : null,
      StartDateMax: Array.isArray(data?.StartDateRange)
        ? data?.StartDateRange[1]
        : null,

      CreatedDateMin: Array.isArray(data?.CreatedDateRange)
        ? data?.CreatedDateRange[0]
        : null,
      CreatedDateMax: Array.isArray(data?.CreatedDateRange)
        ? data?.CreatedDateRange[1]
        : null,

      ExpireDateMin: Array.isArray(data?.ExpireDateRange)
        ? data?.ExpireDateRange[0]
        : null,
      ExpireDateMax: Array.isArray(data?.ExpireDateRange)
        ? data?.ExpireDateRange[1]
        : null
    };

    const {
      StartDateRange,
      CreatedDateRange,
      ExpireDateRange,
      ...filteredData
    } = data;

    const queryParamsData: IHTTPSParams[] = convertFormDataToQueryParams<any>({
      ...dates,
      ...filteredData
    });
    setQueryParams(queryParamsData);

    setRefreshComponent(!refreshComponent);
  };

  // Delete document
  const deleteDocument = async () => {
    if (selectedItem) {
      const res: any = await EdcServies.getInstance().deleteDocument(
        selectedItem.Id
      );
      if (res.isSuccess) {
        toast.success(t('successTxt'), toastOptions);
        setModalVisible(false);
      }
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
  }, [page, refreshComponent]);

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
      <Card size="small" className="mb-4 box">
        <div className="generalFilter">
          <Collapse
            expandIconPosition="end"
            ghost
            style={{
              padding: '0'
            }}
            defaultActiveKey="1"
            size="small"
          >
            <Collapse.Panel
              key={1}
              className="p-0"
              header={<Text type="secondary">{t('filter')}</Text>}
            >
              <Form
                onFinish={handleSubmit(onSubmit)}
                layout="vertical"
                labelWrap={false}
              >
                <Row gutter={16}>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={t('name')}
                      name="DocumentCode"
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('name'))}
                      errors={errors}
                    />
                  </Col>
                </Row>
                <Row justify="end">
                  <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                      <Tooltip title={t('resetTxt')}>
                        <AppHandledButton
                          onClick={() => {
                            reset();
                            setCurrentPage(1);
                            setQueryParams([]);
                            setRefreshComponent(r => !r);
                          }}
                          type="dashed"
                          icon={<UndoOutlined rev={undefined} />}
                        />
                      </Tooltip>
                      <AppHandledButton type="primary" htmlType="submit">
                        {t('searchTxt')}
                      </AppHandledButton>
                    </Space>
                  </div>
                </Row>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Card>
      <Card className="box">
        {fakeData.length ? (
          <Spin size="large" spinning={loading}>
            <AppHandledTable
              columns={columns}
              data={fakeData}
              currentPage={page}
              totalPage={20}
              onChangePage={(e: number) => setCurrentPage(e)}
              key={forceUpdate.current}
              rowKey="id"
            />
          </Spin>
        ) : (
          <Spin size="large" spinning={loading}>
            <AppEmpty />
          </Spin>
        )}
        <Row justify="end" className="generalPagination">
          {RoomListData?.Data?.Datas?.length ? (
            <AppPagination
              current={page}
              total={RoomListData?.Data?.TotalDataCount}
              onChange={(z: number) => setCurrentPage(z)}
            />
          ) : null}
        </Row>
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

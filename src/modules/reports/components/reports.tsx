/* eslint-disable no-nested-ternary */
import { HomeOutlined, UndoOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Space,
  Breadcrumb,
  Spin,
  Typography,
  Table,
  Collapse,
  Form,
  Tooltip,
  Modal
} from 'antd';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import AppEmpty from '@/components/display/empty';
import { TiCancel } from 'react-icons/ti';

import {
  convertFormDataToQueryParams,
  deepClone,
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/functions/functions';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IBookingReportsResponse, IReportFilter, IReportItem } from '../types';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IHTTPSParams } from '@/services/adapter-config/config';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppPagination from '@/components/display/pagination';
import { BiUser } from 'react-icons/bi';
import AddBookingModal from './add-booking-modal';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import { t } from 'i18next';

function convertDateToISO(inputDate: string): any {
  return format(inputDate, "yyyy-MM-dd'T'00:00");
}

export default function Reports() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IReportFilter>({
    mode: 'onChange',
    defaultValues: {
      startDate: null,
      endDate: null,
      deskName: '',
      deskOwnerName: '',
      roomName: '',
      operationType: null
    }
  });

  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );
  const [showAddBookingModal, setShowAddBookingModal] =
    useState<boolean>(false);
  const [showCancelBookModal, setShowCancelBookModal] =
    useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<IReportItem>();

  const [reportsList, setReportsList] = useState<IBookingReportsResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [desksList, setDesksList] = useState<{ name: string; id: number }[]>(
    []
  );
  const [roomsList, setRoomsList] = useState<{ name: string; id: number }[]>(
    []
  );
  const [ownersList, setOwnerssList] = useState<{ name: string; id: number }[]>(
    []
  );
  const columns: ColumnsType<any> = [
    {
      title: 'User name',
      dataIndex: 'userName',
      key: 'userName',
      render: record => renderEllipsisText(record)
    },
    {
      title: 'Room name',
      dataIndex: 'roomName',
      key: 'roomName',
      render: record => renderEllipsisText(record)
    },
    {
      title: 'Desk name',
      dataIndex: 'deskName',
      key: 'deskName',
      render: record => renderEllipsisText(record)
    },
    {
      title: 'Desk owner name',
      dataIndex: 'deskOwnerName',
      key: 'deskOwnerName',
      render: record => renderEllipsisText(record)
    },

    {
      title: 'Operation type',
      dataIndex: 'operationType',
      key: 'operationType',
      render: record =>
        record === 1 ? 'Booking' : record === 2 ? 'Cancel' : '-'
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: record =>
        renderEllipsisText(format(parseISO(record), 'dd.MM.yyyy HH:mm'))
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: record =>
        renderEllipsisText(format(parseISO(record), 'dd.MM.yyyy HH:mm'))
    },
    {
      title: '',
      key: 'actions',
      align: 'end',
      width: 0,
      render: (_, raw: IReportItem) => (
        <AppHandledButton
          danger
          disabled={!raw?.canCancel}
          onClick={() => {
            setSelectedItem(raw);
            setShowCancelBookModal(true);
          }}
          icon={<TiCancel size={18} />}
        />
      )
    }
  ];

  async function fetchReportsList() {
    setLoading(true);
    try {
      const res = await RoomsService.getInstance().getReports([
        ...queryParams,
        { name: 'page', value: page }
      ]);
      setReportsList(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmit: SubmitHandler<IReportFilter> = async (
    data: IReportFilter
  ) => {
    setCurrentPage(1);
    if (data.startDate) {
      data.startDate = convertDateToISO(data?.startDate?.toDate());
    }
    if (data.endDate) {
      data.endDate = convertDateToISO(data?.endDate?.toDate());
    }
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IReportFilter>(data);
    console.log(queryParams, 'xaliq');
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  async function getLists() {
    try {
      const roomsService = RoomsService.getInstance();
      const [desksRes, roomsRes, ownersRes] = await Promise.all([
        roomsService.getDesksComboList(),
        roomsService.getRoomsComboList(),
        roomsService.getOwnerComboList()
      ]);

      if (desksRes) {
        setDesksList(desksRes);
      }
      if (roomsRes) {
        setRoomsList(roomsRes);
      }
      if (ownersRes) {
        setOwnerssList(ownersRes);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchReportsList();
  }, [refreshComponent, page]);

  useEffect(() => {
    getLists();
  }, []);

  const cancelBook = async (id: number) => {
    const res = await RoomsService.getInstance().cancelBook(id);
    if (res) {
      toast.success(res.Data?.Message, toastOptions);
      setRefreshComponent(z => !z);
      setShowCancelBookModal(false);
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
                    title: 'Reports'
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
                    setShowAddBookingModal(true);
                  }}
                  type="primary"
                >
                  <Space>
                    <BiUser />
                    Add Booking
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
              header={
                <Typography.Text type="secondary">Filter</Typography.Text>
              }
            >
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={16}>
                  <Col span={8}>
                    <AppHandledSelect
                      label={'Desk name'}
                      name="deskId"
                      required={false}
                      control={control}
                      placeholder={inputPlaceholderText('Desk name')}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'deskId',
                        placeholder: selectPlaceholderText('Desk name'),
                        className: 'w-full',
                        options:
                          desksList?.map(z => ({
                            value: z?.id,
                            label: z?.name
                          })) || []
                      }}
                    />
                  </Col>

                  <Col span={8}>
                    <AppHandledSelect
                      label={'Desk owner'}
                      name="deskOwnerId"
                      required={false}
                      control={control}
                      placeholder={inputPlaceholderText('Desk owner')}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'deskOwnerId',
                        placeholder: selectPlaceholderText('Desk owner'),
                        className: 'w-full',
                        options:
                          ownersList?.map(z => ({
                            value: z?.id,
                            label: z?.name
                          })) || []
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledSelect
                      label={'Room name'}
                      name="roomId"
                      required={false}
                      control={control}
                      placeholder={inputPlaceholderText('Room name')}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'roomId',
                        placeholder: selectPlaceholderText('Room name'),
                        className: 'w-full',
                        options:
                          roomsList?.map(z => ({
                            value: z?.id,
                            label: z?.name
                          })) || []
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledDate
                      label={'Start date'}
                      name="startDate"
                      control={control}
                      required={false}
                      placeholder={'Start date'}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        allowClear: true,
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledDate
                      label={'End date'}
                      name="endDate"
                      control={control}
                      required={false}
                      placeholder={'End date'}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        allowClear: true,
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledSelect
                      label={'Operation type'}
                      name="operationType"
                      required={false}
                      control={control}
                      placeholder={inputPlaceholderText('Operation type')}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'operationType',
                        placeholder: selectPlaceholderText('Operation type'),
                        className: 'w-full',
                        options: [
                          {
                            value: 1,
                            label: 'Booking'
                          },
                          {
                            value: 2,
                            label: 'Cancel'
                          }
                        ]
                      }}
                    />
                  </Col>
                </Row>
                <Row justify="end">
                  <div style={{ textAlign: 'right' }}>
                    <Space size="small">
                      <Tooltip title="reset">
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
                        Search
                      </AppHandledButton>
                    </Space>
                  </div>
                </Row>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Card>
      <Card>
        {reportsList?.items?.length ? (
          <Spin size="large" spinning={loading}>
            <Row className="pb-10">
              <Col span={24}>
                <Table
                  columns={columns}
                  pagination={false}
                  locale={{
                    emptyText: <AppEmpty />
                  }}
                  dataSource={deepClone(reportsList?.items)}
                />
              </Col>
            </Row>
            <Row justify="end" className="generalPagination">
              <Col>
                <AppPagination
                  current={page}
                  total={reportsList?.totalCount}
                  onChange={(z: number) => setCurrentPage(z)}
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
      {showAddBookingModal && (
        <AddBookingModal
          setShowAddBookingModal={setShowAddBookingModal}
          setRefreshComponent={setRefreshComponent}
          showAddBookingModal={showAddBookingModal}
          roomsList={roomsList}
          ownersList={ownersList}
        />
      )}
      <Modal
        title={t('confirmTitle')}
        open={showCancelBookModal}
        onOk={() => {
          cancelBook(selectedItem?.bookingId || 0);
        }}
        onCancel={() => setShowCancelBookModal(false)}
        okText={t('yesTxt')}
        okType="danger"
        cancelText={t('noTxt')}
      >
        <p>Are you sure you want to cancel?</p>
      </Modal>
    </div>
  );
}

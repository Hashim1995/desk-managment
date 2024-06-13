/* eslint-disable no-unused-vars */
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
  Tooltip
} from 'antd';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import AppEmpty from '@/components/display/empty';
import {
  convertFormDataToQueryParams,
  deepClone,
  inputPlaceholderText,
  selectPlaceholderText
} from '@/utils/functions/functions';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IBookingReportsResponse, IReportFilter } from '../types';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled-input';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IHTTPSParams } from '@/services/adapter-config/config';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppPagination from '@/components/display/pagination';

export default function Reports() {
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IReportFilter>({
    mode: 'onChange',
    defaultValues: {
      startDate: null,
      endDate: null,
      deskName: '',
      deskOwnerName: '',
      userName: ''
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

  const [reportsList, setReportsList] = useState<IBookingReportsResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);

  const columns: ColumnsType<any> = [
    {
      title: 'User name',
      dataIndex: 'userName',
      key: 'userName',
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
      title: 'Room name',
      dataIndex: 'roomName',
      key: 'roomName',
      render: record => renderEllipsisText(record)
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
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IReportFilter>(data);
    console.log(queryParams, 'xaliq');
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetchReportsList();
  }, [refreshComponent, page]);

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
                    <AppHandledInput
                      label={'Desk name'}
                      name="deskName"
                      inputProps={{
                        id: 'deskName'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText('Desk name')}
                      errors={errors}
                    />
                  </Col>

                  <Col span={8}>
                    <AppHandledInput
                      label={'Desk owner name'}
                      name="deskOwnerName"
                      inputProps={{
                        id: 'deskOwnerName'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText('Desk owner name')}
                      errors={errors}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledInput
                      label={'User name'}
                      name="userName"
                      inputProps={{
                        id: 'userName'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText('User name')}
                      errors={errors}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledDate
                      label={'Start Date'}
                      name="startDate"
                      control={control}
                      required={false}
                      placeholder={'Start Date'}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        size: 'large',
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <AppHandledDate
                      label={'End Date'}
                      name="endDate"
                      control={control}
                      required={false}
                      placeholder={'End Date'}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        size: 'large',
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
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
    </div>
  );
}

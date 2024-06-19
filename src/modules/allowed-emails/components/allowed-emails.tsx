import { HomeOutlined, MoreOutlined, UndoOutlined } from '@ant-design/icons';
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
  Modal,
  Collapse,
  Form,
  Tooltip
} from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { toastOptions } from '@/configs/global-configs';
import AppHandledButton from '@/components/display/button/handle-button';
import AppEmpty from '@/components/display/empty';
import {
  convertFormDataToQueryParams,
  deepClone,
  inputPlaceholderText
} from '@/utils/functions/functions';
import {
  IAllowedEmailResponse,
  IAllowedEmails,
  IAllowedEmailsFilter
} from '../types';
import { BiUser } from 'react-icons/bi';
import AppHandledInput from '@/components/forms/input/handled-input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IHTTPSParams } from '@/services/adapter-config/config';
import { AllowedEmailsService } from '@/services/allowed-emails-services/allowed-emails-services';
import AddAllowedEmailModal from './add-allowed-email-modal';
import EditAllowedEmailModal from './edit-allowed-email-modal';
import AppPagination from '@/components/display/pagination';

export default function AllowedEmails() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IAllowedEmailsFilter>({
    mode: 'onChange',
    defaultValues: {
      email: ''
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

  const [allowedEmailsList, setAllowedEmailsList] =
    useState<IAllowedEmailResponse>();
  const [page, setCurrentPage] = useState<number>(1);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [selectedItem, setSelectedItem] = useState<IAllowedEmails>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [showAddAllowedEmailModal, setShowAddAllowedEmailModal] =
    useState<boolean>(false);
  const [showEditAllowedEmailModal, setShowEditAllowedEmailModal] =
    useState<boolean>(false);
  const [showDeleteAllowedEmailModal, setShowDeleteAllowedEmailModal] =
    useState<boolean>(false);

  const columns: ColumnsType<IAllowedEmails> = [
    {
      title: t('email'),
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      render: record => renderEllipsisText(record)
    },
    {
      title: '',
      key: 'actions',
      align: 'end',
      width: 0,
      render: (_, raw: IAllowedEmails) => (
        <Space>
          <Dropdown
            menu={{
              // eslint-disable-next-line no-use-before-define
              items,
              onClick: e => {
                if (e?.key === '0') {
                  setShowEditAllowedEmailModal(true);
                  setSelectedItem(raw);
                }
                if (e?.key === '1') {
                  setSelectedItem(raw);
                  setShowDeleteAllowedEmailModal(true);
                }
              }
            }}
            key={raw?.allowedEmailId}
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

  async function fetchAllowedEmails() {
    setLoading(true);
    try {
      const res = await AllowedEmailsService.getInstance().getAllowedEmailsList(
        [...queryParams, { name: 'page', value: page }]
      );
      setAllowedEmailsList(res);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmit: SubmitHandler<IAllowedEmailsFilter> = async (
    data: IAllowedEmailsFilter
  ) => {
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IAllowedEmailsFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  useEffect(() => {
    fetchAllowedEmails();
  }, [refreshComponent, page]);

  const deleteUser = async (id: number) => {
    const res = await AllowedEmailsService.getInstance().delete(id);
    if (res) {
      toast.success(res.Data?.Message, toastOptions);
      setRefreshComponent(z => !z);
      setShowDeleteAllowedEmailModal(false);
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
                    title: 'Allowed emails'
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
                    setShowAddAllowedEmailModal(true);
                  }}
                  type="primary"
                >
                  <Space>
                    <BiUser />
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
              header={
                <Typography.Text type="secondary">Filter</Typography.Text>
              }
            >
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Row gutter={16}>
                  <Col span={8}>
                    <AppHandledInput
                      label={'Email'}
                      name="email"
                      inputProps={{
                        id: 'email'
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText('Email')}
                      errors={errors}
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
        {allowedEmailsList?.items?.length ? (
          <Spin size="large" spinning={loading}>
            <Row className="pb-10">
              <Col span={24}>
                <Table
                  columns={columns}
                  pagination={false}
                  locale={{
                    emptyText: <AppEmpty />
                  }}
                  dataSource={deepClone(allowedEmailsList?.items)}
                />
              </Col>
            </Row>
            <Row justify="end" className="generalPagination">
              <Col>
                <AppPagination
                  current={page}
                  total={allowedEmailsList?.totalCount}
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
      {showAddAllowedEmailModal && (
        <AddAllowedEmailModal
          setShowAddAllowedEmailModal={setShowAddAllowedEmailModal}
          setRefreshComponent={setRefreshComponent}
          showAddAllowedEmailModal={showAddAllowedEmailModal}
        />
      )}
      {showEditAllowedEmailModal && (
        <EditAllowedEmailModal
          setShowEditAllowedEmailModal={setShowEditAllowedEmailModal}
          setRefreshComponent={setRefreshComponent}
          showEditAllowedEmailModal={showEditAllowedEmailModal}
          selectedItem={selectedItem!}
        />
      )}

      <Modal
        title={t('confirmTitle')}
        open={showDeleteAllowedEmailModal}
        onOk={() => {
          deleteUser(selectedItem?.allowedEmailId || 0);
        }}
        onCancel={() => setShowDeleteAllowedEmailModal(false)}
        okText={t('yesTxt')}
        okType="danger"
        cancelText={t('noTxt')}
      >
        <p>{t('confirmDelete')}</p>
      </Modal>
    </div>
  );
}

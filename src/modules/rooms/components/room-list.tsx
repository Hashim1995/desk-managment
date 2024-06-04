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
  Spin
} from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { HomeOutlined, FileAddOutlined, UndoOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { IHTTPSParams } from '@/services/adapter-config/config';
import {
  convertFormDataToQueryParams,
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

import RoomListItemCard from './room-list-item-card';
import AddRoomModal from '../modals/add-room-modal';

// fake data for test
const fakeData = [
  {
    CreatedUser: 'Sübhan Əzimli',
    Id: 81,
    DocumentCode: '1-2024-02-27-0007',
    DocumentType: 'Müqavilə',
    DocumentStatus: 'Gözləmədə',
    DocumentStatusId: 1,
    DocumentTypeId: 1,
    SenderLegalEntity: 'SETCLAPP IT SOLUTIONS',
    RecieverLegalEntity: 'AZKREDIT BOKT ASC',
    SenderLegalEntityVoen: '2348593049',
    RecieverLegalEntityVoen: '3259890394',
    isDraft: false,
    DocumentCirculationStatus: 0,
    CanVerify: false,
    CanReject: false,
    CanSign: false,
    CanReturn: false,
    ForInfo: false,
    AlertClosed: false,
    CanSelectCirculation: false,
    CanDelete: false,
    CanEdit: true,
    RenewalDate: '2024-02-29T00:00:00'
  }
];

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

  const [RoomListData, setRoomListData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const [page, setCurrentPage] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Partial<any> | null>(null);
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);

  useState<boolean>(false);

  const { Text } = Typography;
  const { useToken } = theme;
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

  // Handle modal visibility
  const handleModalVisibility = () => {
    setModalVisible(true);
  };

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
      <Card size="small" className="box box-margin-y">
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
      <Card size="small" className="box box-margin-y">
        <Row justify="center" style={{ padding: token.paddingXS }}>
          {fakeData.length ? (
            <Spin size="large" spinning={loading}>
              <Row gutter={[0, 10]}>
                {fakeData.map((z: any) => (
                  <Col span={24} key={z.Id}>
                    {' '}
                    <RoomListItemCard
                      isDraft={z?.isDraft}
                      Id={z?.Id}
                      DocumentStatus={z?.DocumentStatus}
                      DocumentTypeId={z?.DocumentTypeId}
                      DocumentType={z?.DocumentType}
                      DocumentCode={z?.DocumentCode}
                      RecieverLegalEntity={z?.RecieverLegalEntity}
                      RecieverLegalEntityVoen={z?.RecieverLegalEntityVoen}
                      SenderLegalEntity={z?.SenderLegalEntity}
                      SenderLegalEntityVoen={z?.SenderLegalEntityVoen}
                      DocumentStatusId={z?.DocumentStatusId}
                      setSelectedItem={setSelectedItem}
                      handleModalVisibility={handleModalVisibility}
                      permission={z?.permission}
                      CanReject={z?.CanReject}
                      CanVerify={z.CanVerify}
                      CanEdit={z.CanEdit}
                      CanSign={z?.CanSign}
                      CanReturn={z.CanReturn}
                      CanSelectCirculation={z.CanSelectCirculation}
                      CanDelete={z?.CanDelete}
                      setRefreshComponent={setRefreshComponent}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>
          ) : (
            <Spin size="large" spinning={loading}>
              <AppEmpty />
            </Spin>
          )}
        </Row>
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

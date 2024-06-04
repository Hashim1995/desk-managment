import {
  Card,
  Row,
  Space,
  Breadcrumb,
  Tooltip,
  Col,
  Typography,
  Divider,
  theme,
  Skeleton,
  Grid,
  Table
} from 'antd';
import {
  HomeOutlined,
  FilePdfOutlined,
  CloseOutlined,
  DotChartOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  IEdcContractTableFileListItem,
  IEdcItemRelationDoc,
  IGetEdcContractByIdResponse
} from '@/modules/rooms/models';
import { EdcServies } from '@/services/edc-services/edc-services';
import {
  convertBytesToReadableSize,
  formatDate,
  generateOptionListPerNumber,
  selectPlaceholderText
} from '@/utils/functions/functions';

import dayjs from 'dayjs';
import { TbTemplate } from 'react-icons/tb';
import AppHandledButton from '@/components/display/button/handle-button';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import DeleteConfirmationModal from '@/components/display/DeleteConfirmationModal/delete-confirmation-modal';
import AppEmpty from '@/components/display/empty/app-empty';
import TokenizedIframe from '@/components/display/iframe/tokenized-iframe';
import RejectModal from '@/components/feedback/reject-modal/reject-modal';
import ReturnModal from '@/components/feedback/return-modal/return-modal';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { toastOptions } from '@/configs/global-configs';
import SelectTemplateForDocument from '@/modules/rooms/modals/selectTemplateForDocument';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ChangeLog from '../../change-log/change-log';

function ViewContract() {
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDraft: boolean = pathname?.includes('draft');
  const {
    setValue,
    control,
    formState: { errors }
  } = useForm({ mode: 'onChange' });

  const { useToken } = theme;
  const { token } = useToken();
  const { t } = useTranslation();

  const [skeleton, setSkeleton] = useState<boolean>(true);
  const [versionLoading, setVersionLoading] = useState<boolean>(false);
  const [edcViewItem, setEdcViewItem] =
    useState<IGetEdcContractByIdResponse['Data']>();
  const [activePdfOnStage, setActivePdfOnStage] =
    useState<IEdcContractTableFileListItem>();
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false);
  const [showReturnForm, setShowReturnForm] = useState<boolean>(false);
  convertBytesToReadableSize;
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [signLoading, setSignLoading] = useState<boolean>(false);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);

  const [
    showSelectTemplatesForDocumentForm,
    setShowSelectTemplatesForDocumentForm
  ] = useState<boolean>(false);

  // Fetching document details by ID
  const getByID = async (docId: string) => {
    const res: IGetEdcContractByIdResponse =
      await EdcServies.getInstance().getContractById(docId, [], isDraft);
    if (res?.isSuccess) {
      setEdcViewItem(res.Data);
      setSkeleton(false);
      setActivePdfOnStage(
        res.Data?.TableFileList?.find(
          (z: IEdcContractTableFileListItem) => z?.type === 1
        )
      );
    } else {
      navigate('/edc');
    }
  };

  // define function for getting the particular version of the document
  const getDocByVersions = async (ver: number, type: number) => {
    if (id) {
      setVersionLoading(true);
      const res = await EdcServies.getInstance().getDocByVersion(id, [
        { name: 'type', value: type },
        { name: 'version', value: ver }
      ]);
      if (res.isSuccess) {
        setActivePdfOnStage(res.Data);
        setVersionLoading(false);
      }
    }
  };

  // define function for openning the rejecting modal
  const rejectDoc = () => {
    setShowRejectForm(true);
  };

  // define function for openning the returning modal
  const returnDoc = () => {
    setShowReturnForm(true);
  };

  // Function to initiate the document sending process
  const sendDoc = () => {
    setShowSelectTemplatesForDocumentForm(true);
  };

  // Function to approve the document
  const approveDoc = async () => {
    if (id) {
      setApproveLoading(true);

      const res = await EdcServies.getInstance().approveDoc(Number(id));
      if (res.isSuccess) {
        setApproveLoading(false);
        setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
        navigate('/edc');
      } else {
        setRefreshComponent(z => !z);
        setApproveLoading(false);
        setSkeleton(false);
      }
    }
  };

  // Function to sign the document
  const signDoc = async () => {
    if (id) {
      setSignLoading(true);
      const res = await EdcServies.getInstance().signDoc(Number(id), () =>
        setSignLoading(false)
      );
      if (res.isSuccess) {
        setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
        // navigate('/edc');
      } else {
        setRefreshComponent(z => !z);
        setSkeleton(false);
      }
      setSignLoading(false);
    }
  };

  // Function to update the document based on its type
  const updateDoc = () => {
    if (edcViewItem?.DocumentTypeId === 1) {
      isDraft
        ? navigate(`/edc/update-contract/draft/${id}`)
        : navigate(`/edc/update-contract/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 2) {
      isDraft
        ? navigate(`/edc/update-addition/draft/${id}`)
        : navigate(`/edc/update-addition/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 3) {
      isDraft
        ? navigate(`/edc/update-invoice/draft/${id}`)
        : navigate(`/edc/update-invoice/${id}`);
    }
    if (edcViewItem?.DocumentTypeId === 4) {
      isDraft
        ? navigate(`/edc/update-act/draft/${id}`)
        : navigate(`/edc/update-act/${id}`);
    }
  };

  const openDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  // function for deleting the draft document
  const deleteDraft = async () => {
    const res = await EdcServies.getInstance().deleteExtra(Number(id));
    if (res.isSuccess) {
      toast.success(res.Data?.message, toastOptions);
      setShowDeleteConfirmationModal(false);
      navigate('/edc');
    }
  };

  useEffect(() => {
    id && getByID(id);
    window.scrollTo(0, 0);
  }, [id, refreshComponent]);

  useEffect(() => {
    setValue('version', activePdfOnStage?.version);
  }, [activePdfOnStage]);

  // Table columns for related docs
  const columns: (
    | ColumnType<IEdcItemRelationDoc>
    | ColumnGroupType<IEdcItemRelationDoc>
  )[] = [
    {
      title: t('documentType'),
      dataIndex: 'DocumentType',
      key: 'DocumentType',
      align: 'center'
    },
    {
      title: t('documentNumber'),
      dataIndex: 'DocumentCode',
      key: 'DocumentCode',
      align: 'center'
    },
    {
      title: t('docDate'),
      dataIndex: 'CreatedDate',
      key: 'CreatedDate',
      width: '33%',
      align: 'center',
      render: (date: string) => {
        const formattedDate = dayjs(date).format('DD.MM.YYYY');
        return <span>{formattedDate}</span>;
      }
    }
  ] as (
    | ColumnType<IEdcItemRelationDoc>
    | ColumnGroupType<IEdcItemRelationDoc>
  )[];

  return (
    <div>
      {!skeleton ? (
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
                        title: (
                          <Link to="/edc">{t('electronicDocumentCycle')}</Link>
                        )
                      },
                      {
                        title: `${t('viewDoc')} - ${id}`
                      }
                    ]}
                  />
                </Space>
              </Col>
              <Col>
                <Space>
                  <Tooltip title={t('navigateToBack')}>
                    <AppHandledButton
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="default"
                    >
                      <Space>
                        <CloseOutlined rev={undefined} />
                      </Space>
                    </AppHandledButton>
                  </Tooltip>
                  {edcViewItem?.CanEdit && (
                    <AppHandledButton type="default" onClick={updateDoc}>
                      <Space>{t('editBtn')}</Space>
                    </AppHandledButton>
                  )}
                  {edcViewItem?.CanDelete && (
                    <AppHandledButton
                      type="default"
                      onClick={openDeleteConfirmationModal}
                    >
                      <Space>{t('delete')}</Space>
                    </AppHandledButton>
                  )}

                  {edcViewItem?.CanReturn && (
                    <AppHandledButton type="default" onClick={returnDoc}>
                      <Space>{t('toReturn')}</Space>
                    </AppHandledButton>
                  )}

                  {edcViewItem?.CanReject && (
                    <AppHandledButton type="default" onClick={rejectDoc}>
                      <Space>{t('toCancel')}</Space>
                    </AppHandledButton>
                  )}
                  {edcViewItem?.CanVerify && (
                    <AppHandledButton
                      type="primary"
                      onClick={approveDoc}
                      disabled={approveLoading}
                      loading={approveLoading}
                    >
                      <Space>{t('toApprove')}</Space>
                    </AppHandledButton>
                  )}
                  {edcViewItem?.CanSign && (
                    <AppHandledButton
                      type="primary"
                      onClick={signDoc}
                      disabled={signLoading}
                      loading={signLoading}
                    >
                      <Space>{t('canSign')}</Space>
                    </AppHandledButton>
                  )}
                  {edcViewItem?.CanSelectCirculation && (
                    <AppHandledButton
                      onClick={sendDoc}
                      htmlType="submit"
                      loading={approveLoading} // change the loading state when the appropriate api is used
                      disabled={approveLoading} // change the loading state when the appropriate api is used
                      type="primary"
                    >
                      <Space>{t('send')}</Space>
                    </AppHandledButton>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
          <Row gutter={15} justify="space-between">
            <Col span={8} lg={8} xl={8} md={24} style={{ height: '967px' }}>
              <Card
                size="small"
                className="box box-margin-y"
                style={{
                  minHeight: '56%',
                  maxHeight: '56%',
                  overflowY: 'auto'
                }}
              >
                <Typography.Text>
                  {' '}
                  {t('generalInfo').toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                <div>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('documentNumber') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.DocumentCode ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentCode ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('documentType') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.DocumentType ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentType ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('receivingLegalEntity') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.RecieverLegalEntity ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.RecieverLegalEntity ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('receivingLegalEntityVAT') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.RecieverLegalEntityVoen ??
                            t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.RecieverLegalEntityVoen ??
                          t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('sendingLegalEntity') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.SenderLegalEntity ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.SenderLegalEntity ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('sendingLegalEntityVAT') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.SenderLegalEntityVoen ??
                            t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.SenderLegalEntityVoen ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('docCreatedate') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.CreatedDate
                            ? formatDate(edcViewItem?.CreatedDate)
                            : t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.CreatedDate
                          ? formatDate(edcViewItem?.CreatedDate)
                          : t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('validityPeriodContract') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.ExpireDate
                            ? formatDate(edcViewItem?.ExpireDate)
                            : t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.ExpireDate
                          ? formatDate(edcViewItem?.ExpireDate)
                          : t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('ContractRenewalPeriod') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: edcViewItem?.RenewalDate
                            ? formatDate(edcViewItem.RenewalDate)
                            : t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.RenewalDate
                          ? formatDate(edcViewItem.RenewalDate)
                          : t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('status') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: 2,
                          tooltip:
                            edcViewItem?.DocumentStatus ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.DocumentStatus ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('template') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      {edcViewItem?.documentApprovalCycle ? (
                        <Typography.Paragraph
                          onClick={() =>
                            window.open(
                              `/settings/circulation-templates/view/${edcViewItem?.documentApprovalCycle?.value}`,
                              '_blank'
                            )
                          }
                          className="custom-text row-pointer"
                          ellipsis={{
                            rows: 2,
                            tooltip:
                              edcViewItem.documentApprovalCycle.label ??
                              t('noDataText')
                          }}
                          strong
                        >
                          <Space
                            className="hoverable"
                            align="start"
                            wrap={false}
                            style={{
                              width: '100%',
                              justifyContent: 'space-between'
                            }}
                          >
                            <p style={{ flex: 1, margin: 0 }}>
                              {edcViewItem.documentApprovalCycle.label ??
                                t('noDataText')}
                            </p>

                            <TbTemplate />
                          </Space>
                        </Typography.Paragraph>
                      ) : (
                        t('noDataText')
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <Typography.Paragraph
                        className="custom-text"
                        style={{
                          color: token.colorTextSecondary
                        }}
                        strong
                      >
                        {t('summary') ?? t('noDataText')}:
                      </Typography.Paragraph>
                    </Col>
                    <Col span={10} offset={2}>
                      <Typography.Paragraph
                        className="custom-text"
                        ellipsis={{
                          rows: !lg ? 4 : 2,
                          tooltip: edcViewItem?.Description ?? t('noDataText')
                        }}
                        strong
                      >
                        {edcViewItem?.Description ?? t('noDataText')}
                      </Typography.Paragraph>
                    </Col>
                  </Row>
                </div>
              </Card>
              <Card
                size="small"
                className="box box-margin-y"
                style={{ minHeight: '19%' }}
              >
                <Typography.Text>
                  {t('documents').toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {edcViewItem?.TableFileList?.length ? (
                  <div>
                    {edcViewItem?.TableFileList?.map(
                      (z: IEdcContractTableFileListItem) => {
                        let tooltipText;
                        if (z.type === 1) {
                          tooltipText = t('fileTypeIsMain');
                        } else if (z.type === 2) {
                          tooltipText = t('fileTypeIsPrivate');
                        } else {
                          tooltipText = t('noDataText');
                        }
                        return (
                          <Row
                            key={z.id}
                            style={{
                              cursor: 'pointer'
                            }}
                            onClick={() => setActivePdfOnStage(z)}
                          >
                            <Col span={3}>
                              <Typography.Paragraph
                                style={{
                                  color: token.colorTextSecondary
                                }}
                                strong
                              >
                                <FilePdfOutlined
                                  style={{
                                    fontSize: token.fontSizeXL,
                                    color: token.red
                                  }}
                                  rev={undefined}
                                />
                              </Typography.Paragraph>
                            </Col>
                            <Col span={21}>
                              <Typography.Paragraph
                                ellipsis={{
                                  rows: 2,
                                  // eslint-disable-next-line no-nested-ternary
                                  tooltip: tooltipText
                                }}
                                strong
                              >
                                {/* eslint-disable-next-line no-nested-ternary */}
                                {tooltipText}
                              </Typography.Paragraph>
                            </Col>
                          </Row>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <AppEmpty />
                )}
              </Card>
              <Card
                size="small"
                className="box box-margin-y"
                style={{
                  minHeight: '23%',
                  maxHeight: '23%',
                  overflowY: 'auto'
                }}
              >
                <Typography.Text>
                  {t('relatedDocs').toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {edcViewItem?.RelationDocs?.length ? (
                  <div>
                    <Table
                      onRow={record => ({
                        onClick: () => {
                          let url = '';
                          if (record.DocumentTypeId === 1) {
                            url = record.isDraft
                              ? `/edc/view-contract/draft/${record.Id}`
                              : `/edc/view-contract/${record.Id}`;
                          } else if (record.DocumentTypeId === 2) {
                            url = record.isDraft
                              ? `/edc/view-addition/draft/${record.Id}`
                              : `/edc/view-addition/${record.Id}`;
                          } else if (record.DocumentTypeId === 3) {
                            url = record.isDraft
                              ? `/edc/view-invoice/draft/${record.Id}`
                              : `/edc/view-invoice/${record.Id}`;
                          } else if (record.DocumentTypeId === 4) {
                            url = record.isDraft
                              ? `/edc/view-act/draft/${record.Id}`
                              : `/edc/view-act/${record.Id}`;
                          }
                          if (url) {
                            window.open(url, '_blank');
                          }
                        }
                      })}
                      size="small"
                      pagination={false}
                      rowClassName={(_, index) =>
                        index !== -1 ? 'row-pointer' : ''
                      }
                      locale={{
                        emptyText: <AppEmpty />
                      }}
                      scroll={{ x: 300 }}
                      columns={columns}
                      dataSource={
                        edcViewItem?.RelationDocs !== null
                          ? edcViewItem?.RelationDocs
                          : []
                      }
                    />
                  </div>
                ) : (
                  <AppEmpty />
                )}
              </Card>
            </Col>
            <Col
              span={16}
              lg={16}
              xl={16}
              md={24}
              style={{ marginTop: !lg ? token.marginLG : '' }}
            >
              <Card
                size="small"
                className="box box-margin-y"
                style={{ minHeight: '978px' }}
              >
                <Typography.Text>
                  {' '}
                  {t('file').toLocaleUpperCase('tr-TR')}
                </Typography.Text>
                <Divider
                  style={{
                    marginTop: token.marginXS,
                    marginBottom: token.marginXS
                  }}
                />
                {!edcViewItem?.isDraft && (
                  <Row>
                    <Col span={6}>
                      <AppHandledSelect
                        name="version"
                        control={control}
                        errors={errors}
                        allowClear={false}
                        label={t('version')}
                        selectProps={{
                          showSearch: true,
                          id: 'version',
                          placeholder: selectPlaceholderText(t('version')),
                          className: 'w-full',
                          options: generateOptionListPerNumber(
                            Number(activePdfOnStage?.totalVersion)
                          ),
                          size: 'large'
                        }}
                        formItemProps={{
                          labelAlign: 'left',
                          labelCol: { lg: 12, md: 16 },
                          style: { fontWeight: 'bolder' }
                        }}
                        onChangeApp={(e: number) => {
                          getDocByVersions(e, activePdfOnStage?.type || 1);
                        }}
                      />
                    </Col>
                  </Row>
                )}
                <div>
                  {!versionLoading ? (
                    <TokenizedIframe
                      className="file-height"
                      tokenized
                      src={activePdfOnStage?.fileUrl ?? ''}
                    />
                  ) : (
                    <Skeleton.Node className="w-full file-height" active>
                      <DotChartOutlined
                        rev={undefined}
                        style={{ fontSize: 40, color: '#bfbfbf' }}
                      />
                    </Skeleton.Node>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            {!isDraft && (
              <ChangeLog id={id} refreshComponent={refreshComponent} />
            )}
          </Row>
          <RejectModal
            setRefreshComponent={setRefreshComponent}
            id={Number(id)}
            showRejectForm={showRejectForm}
            setShowRejectForm={setShowRejectForm}
          />
          <ReturnModal
            setRefreshComponent={setRefreshComponent}
            id={Number(id)}
            showReturnForm={showReturnForm}
            setShowReturnForm={setShowReturnForm}
          />
          <DeleteConfirmationModal
            onCancel={closeDeleteConfirmationModal}
            onOk={deleteDraft}
            visible={showDeleteConfirmationModal}
          />
          {showSelectTemplatesForDocumentForm && (
            <SelectTemplateForDocument
              setRefreshComponent={setRefreshComponent}
              id={Number(id)}
              showSelectTemplatesForDocumentForm={
                showSelectTemplatesForDocumentForm
              }
              setShowSelectTemplatesForDocumentForm={
                setShowSelectTemplatesForDocumentForm
              }
            />
          )}
        </div>
      ) : (
        <div>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      )}
    </div>
  );
}

export default ViewContract;

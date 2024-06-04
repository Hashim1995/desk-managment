// Ant Design components
import {
  Breadcrumb,
  Card,
  Col,
  Collapse,
  Form,
  Modal,
  Row,
  Space,
  theme,
  Popconfirm,
  Tooltip,
  Timeline,
  Table,
  Skeleton,
  Grid
} from 'antd';

// Ant Design icons
import {
  HomeOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  UndoOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
  SwapOutlined,
  FileAddOutlined,
  RetweetOutlined
} from '@ant-design/icons';

// React and related libraries
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import AppRouteBlocker from '@/components/display/blocker/app-route-blocker.tsx';
import AppHandledButton from '@/components/display/button/handle-button';
import ConfirmSaveModalCustom from '@/components/display/ConfirmSaveModalCustom/confirm-save-modal-custom';
import AppEmpty from '@/components/display/empty/app-empty';
import ViewFileModal from '@/components/display/view-file-modal/view-file-modal';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppHandledInput from '@/components/forms/input/handled_input';
import AppHandledInputWithButton from '@/components/forms/input/handled-input-with-button';
import AppHandledSelect from '@/components/forms/select/handled-select';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { toastOptions, getTimeLineStyle } from '@/configs/global-configs';
import { selectOption, ICreateResponse } from '@/models/common';
import { EdcServies } from '@/services/edc-services/edc-services';
import { docStatusOptions } from '@/utils/constants/options';
import {
  formatDate,
  showCloseConfirmationModal,
  inputValidationText,
  inputPlaceholderText,
  minLengthCheck,
  maxLengthCheck,
  selectPlaceholderText
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  ExcludeRootFromKeys,
  IEdcContractForm,
  IEdcContractPayload,
  IEdcContractTableFileListItem,
  IGetEdcContractByIdResponse,
  IGetTemplatesListResponse
} from '@/modules/rooms/models';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';
import FileUploadModal from '../../../modals/file-upload';

function UpdateContract() {
  const userCompanyData = useSelector(
    (state: RootState) => state?.user?.user?.getLegalEntityDto
  );
  const { id } = useParams();
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();
  const { t } = useTranslation();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors }
  } = useForm<IEdcContractForm>({
    mode: 'onChange',
    defaultValues: {
      SenderLegalEntityVoen: '',
      SenderLegalEntityName: '',
      RecieverLegalEntityVoen: '',
      RecieverLegalEntityName: '',
      ProssesType: null,
      DocumentApprovalCycleId: null,
      StartDate: '',
      // receiverUserId: null,
      // recieverForInfos: [],
      ExpireDate: '',
      RenewalDate: '',
      Description: '',
      tableFileList: []
    }
  });
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { useToken } = theme;
  const { token } = useToken();

  const darkMode = useReadLocalStorage('darkTheme');

  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [formIsRequired, setFormIsRequired] = useState<boolean>(false);
  const [selectedTableListItem, setSelectedTableListItem] =
    useState<IEdcContractTableFileListItem>();
  const [showFileViewModal, setShowFileViewModal] = useState<boolean>(false);

  const [activeKeys, setActiveKeys] = useState<string[]>(['1', '2', '3', '4']);
  const [voenInputLoading, setVoenInputLoading] = useState<boolean>(false);
  const [disableRecieverVoen, setdisableRecieverVoen] =
    useState<boolean>(false);
  const [mainSubmitLoading, setMainSubmitLoading] = useState<boolean>(false);
  const [draftSubmitLoading, setDraftSubmitLoading] = useState<boolean>(false);
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [blockRoute, setBlockRoute] = useState(true);
  // const [senderLegalEntityVoen, setSenderLegalEntityVoen] = useState<
  //   string | null
  // >('');
  const [templatesListLoading, setTemplatesListLoading] =
    useState<boolean>(false);
  const [templatesList, setTemplatesList] =
    useState<IGetTemplatesListResponse>();

  // const [receivingEntityEmployees, setReceivingEntityEmployees] =
  //   useState<IGetReceiverEntityStaffResponse | null>();
  // const [selectedReceiver, setSelectedReceiver] = useState<number[]>([]);
  // const [receivingEntityEmployeesLoading, setReceivingEntityEmployeesLoading] =
  //   useState<boolean>(false);

  // useEffect(() => {
  //   setActiveKeys(['1'])
  // }, [])

  const getByID = async (docId: string) => {
    setSkeleton(true);
    const isDraft: boolean = pathname?.includes('draft');

    const res: IGetEdcContractByIdResponse =
      await EdcServies.getInstance().getContractById(
        docId,
        [{ name: 'IsUpdate', value: 'true' }],
        isDraft
      );

    if (res.isSuccess) {
      setSkeleton(false);
      const { Data } = res;
      // setSenderLegalEntityVoen(Data?.SenderLegalEntityVoen ?? '');
      setValue('Description', Data?.Description ?? '');
      setValue('SenderLegalEntityVoen', Data?.SenderLegalEntityVoen ?? '');
      setValue('SenderLegalEntityName', Data?.SenderLegalEntity ?? '');
      setValue('RecieverLegalEntityVoen', Data?.RecieverLegalEntityVoen ?? '');
      setValue('RecieverLegalEntityName', Data?.RecieverLegalEntity ?? '');
      setValue('DocumentApprovalCycleId', Data?.documentApprovalCycle ?? null);

      setValue(
        'StartDate',
        Data?.StartDate
          ? dayjs(formatDate(Data?.StartDate ?? ''), 'DD.MM.YYYY')
          : ''
      );
      setValue(
        'ExpireDate',
        Data?.ExpireDate
          ? dayjs(formatDate(Data?.ExpireDate ?? ''), 'DD.MM.YYYY')
          : ''
      );
      setValue(
        'RenewalDate',
        Data?.RenewalDate
          ? dayjs(formatDate(Data?.RenewalDate ?? ''), 'DD.MM.YYYY')
          : ''
      );

      setValue('tableFileList', Data?.TableFileList);

      const ProssesTypeObj = docStatusOptions.find(
        (z: selectOption) => z?.value === Data?.ProssesType
      );

      setValue('ProssesType', ProssesTypeObj ? [ProssesTypeObj] : null);
    } else {
      setSkeleton(false);
      toast.error(res.errors[0], toastOptions);
    }
  };

  const fetchTemplatesList = async () => {
    setTemplatesListLoading(true);
    const res: IGetTemplatesListResponse =
      await EdcServies.getInstance().getTemplatesList();
    setTemplatesList(res);
    setTemplatesListLoading(false);
  };

  const handleDotClick = (dotKey: string) => {
    if (activeKeys.includes(dotKey)) {
      setActiveKeys(activeKeys.filter(key => key !== dotKey));
    } else {
      setActiveKeys([...activeKeys, dotKey]);
    }
  };

  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        setShowUploadFileModal(false);
      }
    });
  };

  const updateMainContract = async (data: IEdcContractPayload) => {
    const isDraft: boolean = pathname?.includes('draft');
    if (data?.tableFileList?.length !== 2) {
      toast.error(inputValidationText(t('doc')), toastOptions);
      return;
    }
    setMainSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateContractMain(
        String(id),
        isDraft,
        data,
        () => {
          setMainSubmitLoading(false);
        }
      );
    if (res.isSuccess) {
      toast.success(t('successTxt'), toastOptions);
      navigate(`/edc/view-contract/${res?.Data?.id}`);
    } else {
      Array.isArray(res.errors) &&
        res.errors?.forEach(error => {
          toast.error(error, toastOptions);
        });
      setMainSubmitLoading(false);
    }
    setMainSubmitLoading(false);
  };

  const updateDraftContract = async (data: IEdcContractPayload) => {
    const isDraft: boolean = pathname?.includes('draft');
    setDraftSubmitLoading(true);

    const res: ICreateResponse =
      await EdcServies.getInstance().updateContractDraft(
        String(id),
        isDraft,
        data,
        () => {
          setDraftSubmitLoading(false);
        }
      );
    if (res.isSuccess) {
      toast.success(t('successTxt'), toastOptions);
      navigate(`/edc/view-contract/draft/${res?.Data?.id}`);
    } else {
      toast.error(res.errors[0], toastOptions);
      setDraftSubmitLoading(false);
    }
    setDraftSubmitLoading(false);
  };

  const onSubmit: SubmitHandler<IEdcContractForm> = async (
    data: IEdcContractForm
  ) => {
    setBlockRoute(false);
    const startDate = data?.StartDate
      ? new Date(data.StartDate.$y, data.StartDate.$M, data.StartDate.$D)
      : null;

    const expireDate = data?.ExpireDate
      ? new Date(data.ExpireDate.$y, data.ExpireDate.$M, data.ExpireDate.$D)
      : null;

    const renewalDate = data?.RenewalDate
      ? new Date(data.RenewalDate.$y, data.RenewalDate.$M, data.RenewalDate.$D)
      : null;

    const payload: IEdcContractPayload = {
      ...data,
      RecieverLegalEntityVoen: data?.RecieverLegalEntityVoen,
      DocumentApprovalCycleId:
        typeof data?.DocumentApprovalCycleId === 'object'
          ? Number(data?.DocumentApprovalCycleId?.value)
          : data?.DocumentApprovalCycleId,
      ProssesType: Array.isArray(data?.ProssesType)
        ? data?.ProssesType[0].value
        : data?.ProssesType,
      Description: data?.Description,
      ExpireDate: data?.ExpireDate
        ? dayjs(expireDate?.toISOString()).format()
        : null,
      RenewalDate: data?.RenewalDate
        ? dayjs(renewalDate?.toISOString()).format()
        : null,
      StartDate: data?.StartDate
        ? dayjs(startDate?.toISOString()).format()
        : null,
      tableFileList: data?.tableFileList?.map(z => ({
        type: z?.type,
        id: z?.id
      }))
    };

    if (formIsRequired) {
      updateMainContract(payload);
    } else {
      updateDraftContract(payload);
    }
  };

  const removeItemFromTableList = (
    selectedItem: IEdcContractTableFileListItem
  ): void => {
    const filtered = watch('tableFileList')?.filter(
      (z: IEdcContractTableFileListItem) => z?.id !== selectedItem?.id
    );
    setValue('tableFileList', filtered);
  };

  const columns: ColumnsType<IEdcContractTableFileListItem> = [
    {
      title: 'Sənədin tipi',
      dataIndex: 'type',
      key: 'name',
      render: (record: number) =>
        record === 1 ? t('fileTypeIsMain') : t('fileTypeIsPrivate')
    },
    {
      title: 'Sənədin adı',
      dataIndex: 'name',
      key: 'age'
    },
    {
      title: '',
      align: 'right',
      key: 'actions',
      render: (record: IEdcContractTableFileListItem) => (
        <Space>
          <Tooltip title={t('delete')}>
            <Popconfirm
              title={t('dataWillBeDeleted')}
              description={t('sure')}
              onConfirm={() => removeItemFromTableList(record)}
              okText={t('yesTxt')}
              cancelText={t('closeBtn')}
            >
              <DeleteOutlined
                style={{
                  cursor: 'pointer',
                  fontSize: token.fontSizeXL,
                  color: token.colorPrimary
                }}
                size={23}
                rev={undefined}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title={t('view')}>
            <FilePdfOutlined
              style={{
                cursor: 'pointer',
                fontSize: token.fontSizeXL,
                color: token.colorPrimary
              }}
              rev={undefined}
              onClick={() => {
                setSelectedTableListItem(record);
                setShowFileViewModal(true);
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const getByVoen = async () => {
    if (userCompanyData?.Voen === watch('RecieverLegalEntityVoen')) {
      toast.error(t('voenMustBeDifferent'), toastOptions);
      setError('RecieverLegalEntityVoen', {
        type: 'custom',
        message: t('voenMustBeDifferent')
      });
    } else {
      const edcServiceInstance = EdcServies.getInstance();
      if (watch('RecieverLegalEntityVoen')?.length > 0) {
        setVoenInputLoading(true);
        edcServiceInstance
          .getByVoen(watch('RecieverLegalEntityVoen'), () => {
            setVoenInputLoading(false);
            setValue('RecieverLegalEntityName', '');
          })
          .then(res => {
            if (res.isSuccess) {
              setValue('RecieverLegalEntityName', res?.Data?.Name);
              setdisableRecieverVoen(true);
              toast.success(t('successTxt'), toastOptions);
              // setReceivingEntityEmployeesLoading(true);
              // edcServiceInstance
              //   .getReceivingEntityEmployeesList(
              //     watch('RecieverLegalEntityVoen')
              //   )
              //   .then(resStaff => {
              //     if (resStaff.isSuccess) {
              //       setReceivingEntityEmployees(resStaff);
              //     }
              //     setReceivingEntityEmployeesLoading(false);
              //   })
              //   .catch(error => {
              //     console.error(error);
              //   });
            } else {
              toast.error(t('errorOccurred'), toastOptions);
            }
            setVoenInputLoading(false);
          })
          .catch(error => {
            console.error(error);
            setError('RecieverLegalEntityVoen', {
              type: 'custom',
              message: t('required')
            });
          });
      }
    }
  };

  useEffect(() => {
    id && getByID(id);
    fetchTemplatesList();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setActiveKeys(['1']);
  }, [skeleton]);

  useEffect(() => {
    if (formIsRequired) {
      if (Object.keys(errors).length !== 0) {
        setActiveKeys(['1', '2', '3', '4']);
      }
      setFocus('RecieverLegalEntityVoen');
      const firstError = (
        Object.keys(errors) as Array<
          keyof ExcludeRootFromKeys<IEdcContractForm>
        >
      ).reduce<keyof ExcludeRootFromKeys<IEdcContractForm> | null>(
        (field, a) => {
          const fieldKey = field as keyof ExcludeRootFromKeys<IEdcContractForm>;
          return errors[fieldKey] ? fieldKey : a;
        },
        null
      );

      if (firstError) {
        setFocus(firstError);
        setFocus('RecieverLegalEntityVoen');
      }
    }
  }, [errors, skeleton]);

  type PayloadKey = keyof IEdcContractPayload;

  useEffect(() => {
    if (formIsRequired) {
      Object.entries(errors).forEach(([key, value]) => {
        if ((key in {}) as unknown as Record<string, PayloadKey>) {
          setError(key as PayloadKey, {
            type: String(value.type),
            message: String(value.message)
          });
        }
      });
    }
  }, [activeKeys]);

  const suffix = watch('RecieverLegalEntityName') ? (
    <Tooltip title={t('resetTxt')}>
      <AppHandledButton
        onClick={() => {
          setVoenInputLoading(false);
          setValue('RecieverLegalEntityName', '');
          setdisableRecieverVoen(false);
          2348593049;
        }}
        type="dashed"
        icon={<UndoOutlined rev={undefined} />}
      />
    </Tooltip>
  ) : (
    <Tooltip title={t('searchTxt')}>
      <AppHandledButton
        onClick={() => {
          getByVoen();
        }}
        type="dashed"
        icon={<SearchOutlined rev={undefined} />}
      />
    </Tooltip>
  );

  return (
    <div>
      <AppRouteBlocker open={blockRoute} />

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
                    title: <Link to="/edc">{t('electronicDocumentCycle')}</Link>
                  },
                  {
                    title: <Link to="/edc">{`${t('viewDoc')} - ${id}`}</Link>
                  },
                  {
                    title: `${t('editDoc')} - ${id}`
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

              <ConfirmSaveModalCustom
                okText={t('yesTxt')}
                closeText={t('noTxt')}
                descriptionText={t('confirmationSaveDraftMessage')}
                isRequired={setFormIsRequired}
                loading={draftSubmitLoading}
                form="update-contract-form"
                titleText={t('confirmTitle')}
              />
              <AppHandledButton
                onClick={() => {
                  setFormIsRequired(true);
                  setActiveKeys(['1', '2', '3', '4']);
                  // if (Object.keys(errors).length !== 0) {
                  //   setActiveKeys(['1', '2', '3', '4']);
                  // }
                }}
                form="update-contract-form"
                htmlType="submit"
                loading={mainSubmitLoading}
                disabled={mainSubmitLoading}
                type="primary"
              >
                <Space>{t('editAndSend')}</Space>
              </AppHandledButton>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card size="small" className="box box-margin-y">
        {!skeleton ? (
          <Form
            id="update-contract-form"
            onFinish={handleSubmit(onSubmit)}
            layout={!lg ? 'vertical' : 'horizontal'}
            className="updateForm"
          >
            <Timeline
              style={{ color: token.colorPrimary, padding: token.paddingMD }}
            >
              <Timeline.Item
                dot={
                  <SwapOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('1')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div
                  className="updateContact"
                  aria-hidden
                  onClick={() => {
                    handleDotClick('1');
                  }}
                >
                  <Collapse
                    defaultActiveKey="1"
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel header={t('exchangeData')} key="1">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={t('sendingLegalEntityVAT')}
                              name="SenderLegalEntityVoen"
                              control={control}
                              required={false}
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                t('sendingLegalEntityVAT')
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={t('sendingLegalEntity')}
                              name="SenderLegalEntityName"
                              control={control}
                              required={false}
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                t('sendingLegalEntity')
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledInputWithButton
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    t('receivingLegalEntityVAT')
                                  )
                                },
                                minLength: {
                                  value: formIsRequired ? 10 : 0,
                                  message: minLengthCheck(
                                    t('receivingLegalEntityVAT'),
                                    '10'
                                  )
                                },
                                maxLength: {
                                  value: 10,
                                  message: maxLengthCheck(
                                    t('receivingLegalEntityVAT'),
                                    '10'
                                  )
                                },
                                pattern: {
                                  value: /^\d{10}$/,
                                  message: t('voenRegexChecker')
                                }
                              }}
                              label={t('receivingLegalEntityVAT')}
                              name="RecieverLegalEntityVoen"
                              control={control}
                              required
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                t('receivingLegalEntityVAT')
                              )}
                              btn={suffix}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',

                                disabled:
                                  voenInputLoading || disableRecieverVoen
                              }}
                            />
                          </Col>

                          <Col className="gutter-row" span={24}>
                            <AppHandledInput
                              label={t('receivingLegalEntity')}
                              name="RecieverLegalEntityName"
                              control={control}
                              required
                              inputType="text"
                              placeholder={inputPlaceholderText(
                                t('receivingLegalEntity')
                              )}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              inputProps={{
                                size: 'large',
                                disabled: true
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={t('docStatus')}
                              name="ProssesType"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(t('docStatus'))
                                }
                              }}
                              placeholder={inputPlaceholderText(t('docStatus'))}
                              errors={errors}
                              selectProps={{
                                showSearch: true,
                                id: 'ProssesType',
                                placeholder: selectPlaceholderText(
                                  t('docStatus')
                                ),
                                className: 'w-full',
                                options: docStatusOptions,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <RetweetOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('2')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div
                  className="updateContact"
                  aria-hidden
                  onClick={() => handleDotClick('2')}
                >
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel header={t('circulation')} key="2">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledSelect
                              label={t('templateName')}
                              name="DocumentApprovalCycleId"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    t('templateName')
                                  )
                                }
                              }}
                              placeholder={inputPlaceholderText(
                                t('templateName')
                              )}
                              getLabelOnChange
                              errors={errors}
                              selectProps={{
                                loading: templatesListLoading,
                                disabled: templatesListLoading,
                                showSearch: true,
                                id: 'DocumentApprovalCycleId',
                                placeholder: selectPlaceholderText(
                                  t('templateName')
                                ),
                                className: 'w-full',
                                options: templatesList?.Data?.Datas,
                                size: 'large'
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <InfoCircleOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('3')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div
                  className="updateContact"
                  aria-hidden
                  onClick={() => handleDotClick('3')}
                >
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel header={t('docInfo')} key="3">
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={24}>
                            <AppHandledDate
                              label={t('contractDate')}
                              name="StartDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    t('contractDate')
                                  )
                                }
                              }}
                              placeholder={t('ddmmyyyy')}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              onChangeApp={() => {
                                setValue('RenewalDate', null);
                                setValue('ExpireDate', null);
                              }}
                              dateProps={{
                                size: 'large',
                                style: {
                                  width: '100%'
                                },
                                format: 'DD.MM.YYYY',

                                disabledDate: current =>
                                  current &&
                                  current < dayjs().endOf('day').add(-1, 'day')
                              }}
                            />
                            <AppHandledDate
                              label={t('validityPeriodContract')}
                              name="ExpireDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    t('validityPeriodContract')
                                  )
                                }
                              }}
                              placeholder={t('ddmmyyyy')}
                              errors={errors}
                              onChangeApp={() => {
                                setValue('RenewalDate', null);
                              }}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              dateProps={{
                                size: 'large',
                                style: {
                                  width: '100%'
                                },
                                format: 'DD.MM.YYYY',
                                disabled: !watch('StartDate'),

                                disabledDate: current => {
                                  const v = dayjs(watch('StartDate'));
                                  return (
                                    current &&
                                    (current.isBefore(v) ||
                                      current.isSame(v, 'day'))
                                  );
                                }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledDate
                              label={t('ContractRenewalPeriod')}
                              name="RenewalDate"
                              control={control}
                              required
                              rules={{
                                required: {
                                  value: formIsRequired,
                                  message: inputValidationText(
                                    t('ContractRenewalPeriod')
                                  )
                                }
                              }}
                              placeholder={t('ddmmyyyy')}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              dateProps={{
                                size: 'large',
                                style: {
                                  width: '100%'
                                },
                                format: 'DD.MM.YYYY',
                                disabled: !watch('ExpireDate'),
                                disabledDate: current => {
                                  const v = dayjs(watch('ExpireDate'));
                                  return (
                                    current &&
                                    (current.isBefore(v) ||
                                      current.isSame(v, 'day'))
                                  );
                                }
                              }}
                            />
                          </Col>
                          <Col className="gutter-row" span={24}>
                            <AppHandledTextArea
                              label={t('summary')}
                              name="Description"
                              control={control}
                              required={false}
                              placeholder={inputPlaceholderText(t('summary'))}
                              errors={errors}
                              formItemProps={{
                                labelAlign: 'left',
                                labelCol: { span: 8 },
                                style: { fontWeight: 'bolder' }
                              }}
                              textareaProps={{
                                size: 'large',
                                row: 112
                              }}
                            />
                          </Col>
                        </Row>
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
              <Timeline.Item
                dot={
                  <FileAddOutlined
                    rev={undefined}
                    onClick={() => handleDotClick('4')}
                    style={getTimeLineStyle(token)}
                  />
                }
                color="blue"
              >
                <div
                  className="updateContact"
                  aria-hidden
                  onClick={() => handleDotClick('4')}
                >
                  <Collapse
                    activeKey={activeKeys}
                    style={{ marginLeft: token.marginMD }}
                  >
                    <Collapse.Panel
                      extra={
                        <Tooltip title={t('uploadFile')}>
                          <PlusCircleOutlined
                            onClick={e => {
                              watch('tableFileList')?.length < 2
                                ? setShowUploadFileModal(true)
                                : toast.warn(
                                    'Yalnız 2 sənəd əlavə edə bilərsiniz',
                                    toastOptions
                                  );
                              e.stopPropagation();
                            }}
                            style={{
                              fontSize: token.fontSizeHeading4
                            }}
                            rev={undefined}
                          />
                        </Tooltip>
                      }
                      header={t('docInfo')}
                      key="4"
                    >
                      <div onClick={e => e.stopPropagation()} aria-hidden>
                        {watch('tableFileList')?.length ? (
                          <div>
                            <Table
                              pagination={false}
                              size="small"
                              locale={{
                                emptyText: <AppEmpty />
                              }}
                              columns={columns}
                              dataSource={
                                watch('tableFileList')?.length
                                  ? watch('tableFileList')
                                  : []
                              }
                            />
                          </div>
                        ) : (
                          <div
                            aria-hidden
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowUploadFileModal(true)}
                          >
                            <AppEmpty />
                          </div>
                        )}
                      </div>
                    </Collapse.Panel>
                  </Collapse>
                </div>
              </Timeline.Item>
            </Timeline>
          </Form>
        ) : (
          <div>
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        )}
      </Card>
      <Modal
        width={700}
        destroyOnClose
        title={t('uploadFile')}
        open={showUploadFileModal}
        onCancel={handleClose}
        cancelText={t('closeBtn')}
        okText={t('save')}
        className="generalModal"
        footer={[
          <AppHandledButton onClick={handleClose}>
            {t('closeBtn')}
          </AppHandledButton>,
          <AppHandledButton
            form="file-upload-modal-form"
            type="primary"
            key="submit"
            htmlType="submit"
          >
            {t('save')}
          </AppHandledButton>
        ]}
      >
        <FileUploadModal
          globalWatch={watch}
          setShowUploadFileModal={setShowUploadFileModal}
          globalSetvalue={setValue}
        />
      </Modal>
      <Modal
        open={showFileViewModal}
        title={selectedTableListItem?.name}
        onCancel={() => setShowFileViewModal(false)}
        destroyOnClose
        width={992}
        cancelText={t('closeBtn')}
        okText={t('save')}
        className="generalModal"
        footer={[
          <AppHandledButton onClick={() => setShowFileViewModal(false)}>
            {t('closeBtn')}
          </AppHandledButton>
        ]}
      >
        <ViewFileModal src={selectedTableListItem} />
      </Modal>
    </div>
  );
}

export default UpdateContract;

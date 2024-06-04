import { useState, useRef, useEffect } from 'react';
import {
  Breadcrumb,
  Card,
  Col,
  Collapse,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Space,
  Spin,
  Switch,
  theme,
  Tooltip,
  Typography
} from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UndoOutlined, MoreOutlined } from '@ant-design/icons';
import { BooksServices } from '@/services/books-services/books-service';
import { statusOptions } from '@/utils/constants/options';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  convertFormDataToQueryParams,
  getLanguageName,
  inputPlaceholderText,
  selectPlaceholderText,
  showDeleConfirmationModal,
  toCapitalize
} from '@/utils/functions/functions';
import { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { IGlobalResponse } from '@/models/common';
import { useReadLocalStorage } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IHTTPSParams } from '@/services/adapter-config/config';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled_input';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppHandledSelect from '@/components/forms/select/handled-select';
import AppHandledTable from '@/components/display/table/table';
import AppHandledDateRangePicker from '@/components/forms/date/handle-date-range-picker';
import AddBookModal from '../modals/add-book-modal';
import EditBookModal from '../modals/edit-book-modal';
import ViewBook from '../modals/view-book-modal';
import { IBooksFilter, IBooksItem, IGetBooksResponse } from '../models';

/**
 * React component for managing books.
 * @module Books
 *  * @returns {JSX.Element} Books component JSX
 */

function Books() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IBooksFilter>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      author: '',
      price: null,
      isActive: null
    }
  });

  const { t } = useTranslation();

  // State variables
  const darkMode = useReadLocalStorage('darkTheme');
  const [selectedItem, setSelectedItem] = useState<IBooksItem>();
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [showUpdateBookModal, setShowUpdateBookModal] =
    useState<boolean>(false);
  const [showViewBookModal, setShowViewBookModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [booksData, setBooksData] = useState<IBooksItem[] | null>(null);
  const [refreshComponent, setRefreshComponent] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IHTTPSParams[]>([]);
  const forceUpdate = useRef<number>(0);

  const { Text } = Typography;
  const { useToken } = theme;
  const { token } = useToken();

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

  /**
   * Fetches the list of books from the server.
   * @async
   */
  const fetchBooksList = async () => {
    try {
      setLoading(true);
      const res: IGetBooksResponse =
        await BooksServices.getInstance().getAllBooks([
          ...queryParams,
          { name: 'offset', value: page }
        ]);
      if (res?.isSuccess) {
        setBooksData(res?.data?.data);
        setTotalPage(res?.data?.totalDataCount);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a book from the server.
   * @param {number} id - The ID of the book to be deleted
   */
  const deleteBook = async (id: number) => {
    try {
      setLoading(true);
      const res: IGlobalResponse = await BooksServices.getInstance().deleteBook(
        id
      );
      if (res?.isSuccess) {
        toast.success(t('successTxt'));
        fetchBooksList();
      }
    } catch (error) {
      toast.error(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the delete action for a book.
   * @param {IBooksItem} raw - The book item to be deleted
   */
  const handleDelete = (raw: IBooksItem) => {
    showDeleConfirmationModal({
      isDark: Boolean(darkMode),
      titleText: t('confirmTitle'),
      descriptionText: t('deleteModal'),
      okText: t('yesTxt'),
      onClose: () => {
        deleteBook(raw?.id);
      }
    });
  };

  /**
   * Handles the status change for a book.
   * @param {number} id - The ID of the book whose status is being changed
   */
  const onChangeStatus = async (id: number) => {
    try {
      setLoading(true);

      const res: IGlobalResponse =
        await BooksServices.getInstance().changeStatus(id);

      if (res?.isSuccess) {
        setLoading(false);
        setRefreshComponent(!refreshComponent);
        toast.success(t('statusSuccessMessage'));
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors here
      console.error('An error occurred:', error);
      setLoading(false); // Make sure loading state is reset in case of error
    }
  };

  /**
   * Renders ellipsis text for a given record.
   * @param {string} record - The text to render with ellipsis
   * @returns {JSX.Element} Paragraph element with ellipsis
   */
  const renderEllipsisText = (record: string) => (
    <Typography.Paragraph
      style={{ margin: 0 }}
      ellipsis={{ rows: 2, tooltip: record }}
    >
      {record}
    </Typography.Paragraph>
  );

  const fakeData = [
    {
      name: 'nippon',
      author: 'Banzai',
      description: 'description',
      price: 'price',
      language: 1,
      status: true
    }
  ];

  const handleMenuClick = (e: any, raw: any) => {
    if (e?.key === '0') {
      // If the clicked menu item's key is '0', set the selected item and show the update staff modal.
      setSelectedItem(raw);
      setShowUpdateBookModal(true);
    }
    if (e?.key === '1') {
      setSelectedItem(raw);
      setShowViewBookModal(true);
    }
    if (e?.key === '2') {
      handleDelete(raw);
    }
  };

  const columns: ColumnsType<IBooksItem> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('author'),
      dataIndex: 'author',
      key: 'author',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      render: record => renderEllipsisText(record)
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      render: (record: string) => (
        <Typography.Paragraph
          style={{ margin: 0 }}
          ellipsis={{ rows: 1, tooltip: record }}
        >
          {`${record} AZN`}
        </Typography.Paragraph>
      )
    },
    {
      title: t('language'),
      dataIndex: 'language',
      key: 'language',
      render: record => renderEllipsisText(getLanguageName(record))
    },
    {
      title: t('status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (record: boolean, raw: IBooksItem) => (
        <Tooltip placement="top" title="Statusu dəyiş">
          <Switch checked={record} onChange={() => onChangeStatus(raw?.id)} />
        </Tooltip>
      )
    },
    {
      title: '',
      key: 'actions',
      width: 0,
      render: (_, raw: IBooksItem) => (
        <Space>
          <Dropdown
            menu={{
              items,
              onClick: e => handleMenuClick(e, raw)
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
  console.log(booksData);
  const onSubmit: SubmitHandler<IBooksFilter> = async (data: IBooksFilter) => {
    setCurrentPage(1);
    const queryParamsData: IHTTPSParams[] =
      convertFormDataToQueryParams<IBooksFilter>(data);
    setQueryParams(queryParamsData);
    setRefreshComponent(!refreshComponent);
  };

  // Effect hook to fetch books list on component mount or when page/refreshComponent changes
  useEffect(() => {
    fetchBooksList();
  }, [page, refreshComponent]);

  return (
    <div className="booksContainer">
      <Card size="small" className="box box-margin-y">
        <Row justify="space-between" align="middle">
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
                title: t('books')
              }
            ]}
          />
          <Tooltip placement="right" title={t('addBtn')}>
            <AppHandledButton
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              loading={loading}
              onClick={() => {
                setShowAddBookModal(true);
              }}
              icon={<AiOutlinePlus />}
            />
          </Tooltip>
        </Row>
      </Card>

      <Card size="small" className="box box-margin-y ">
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
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
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
                      name="Name"
                      inputProps={{
                        id: 'name'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('name'))}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledInput
                      label={t('surname')}
                      name="Surname"
                      inputProps={{
                        id: 'surname'
                      }}
                      control={control}
                      required={false}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('surname'))}
                      errors={errors}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledDate
                      label={toCapitalize(t('actionDate'))}
                      name="CreatedDate"
                      control={control}
                      placeholder={t('ddmmyyyy')}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 12, lg: 12 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        className: 'styled-controlled-date-picker',
                        size: 'large',
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
                      }}
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledDateRangePicker
                      label={t('DateRange')}
                      name="DateRange"
                      control={control}
                      errors={errors}
                      formItemProps={{
                        labelAlign: 'left',
                        labelCol: { span: 8, sm: 12, md: 12, lg: 12 },
                        style: { fontWeight: 'bolder' }
                      }}
                      dateProps={{
                        className: 'styled-controlled-date-picker',
                        size: 'large',
                        style: {
                          width: '100%'
                        },
                        format: 'DD.MM.YYYY'
                      }}
                    />
                  </Col>

                  <Col
                    className="gutter-row"
                    style={{ marginBottom: token.marginSM }}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <AppHandledSelect
                      label={t('status')}
                      required={false}
                      name="StatusId"
                      control={control}
                      placeholder={inputPlaceholderText(t('status'))}
                      errors={errors}
                      selectProps={{
                        allowClear: true,
                        showSearch: true,
                        id: 'StatusId',
                        placeholder: selectPlaceholderText(t('status')),
                        className: 'w-full',
                        options: statusOptions
                      }}
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

      <Spin size="large" spinning={loading}>
        <AppHandledTable
          columns={columns}
          data={fakeData}
          currentPage={page}
          totalPage={totalPage}
          onChangePage={(e: number) => setCurrentPage(e)}
          key={forceUpdate.current}
          rowKey="id"
        />
      </Spin>

      {showAddBookModal && (
        <AddBookModal
          setShowAddBookModal={setShowAddBookModal}
          setRefreshComponent={setRefreshComponent}
          showAddBookModal={showAddBookModal}
        />
      )}
      {showUpdateBookModal && selectedItem && (
        <EditBookModal
          selectedItem={selectedItem}
          setShowUpdateBookModal={setShowUpdateBookModal}
          setRefreshComponent={setRefreshComponent}
          showUpdateBookModal={showUpdateBookModal}
        />
      )}
      {showViewBookModal && selectedItem && (
        <ViewBook
          setShowViewBookModal={setShowViewBookModal}
          showViewBookModal={showViewBookModal}
          selectedItem={selectedItem}
        />
      )}
    </div>
  );
}

export default Books;

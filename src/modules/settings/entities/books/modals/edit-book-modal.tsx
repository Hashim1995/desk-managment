import { IGlobalResponse } from '@/models/common';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal,
  tokenizeImage
} from '@/utils/functions/functions';
import { BooksServices } from '@/services/books-services/books-service';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledInput from '@/components/forms/input/handled_input';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import AppFileUpload from '@/components/forms/file-upload/file-upload';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import { useTranslation } from 'react-i18next';
import { IAddBookForm, IBooksItem } from '../models';

/**
 * @component
 * @example
 * jsx
 * <div>
 *   <ul>
 *     {/* Your list of books here *\/}
 *     {books.map((book) => (
 *       <li key={book.id}>
 *         <button onClick={() => handleEditBook(book)}>Edit {book.name}</button>
 *       </li>
 *     ))}
 *   </ul>
 *   {showUpdateBookModal && selectedItem && (
 *     <EditBookModal
 *       selectedItem={selectedItem}
 *       showUpdateBookModal={showUpdateBookModal}
 *       setShowUpdateBookModal={setShowUpdateBookModal}
 *       setRefreshComponent={setRefreshComponent} // Assuming a function to refresh parent data
 *     />
 *   )}
 * </div>
 *
 * Renders a modal for editing a book.
 *
 * @prop {IBooksItem} selectedItem - The book object to be edited.
 * @prop {boolean} showUpdateBookModal - Flag indicating whether the modal is visible.
 * @prop {Dispatch<SetStateAction<boolean>>} setShowUpdateBookModal - Callback function to control the modal's visibility.
 * @prop {Dispatch<SetStateAction<boolean>>} setRefreshComponent - Callback function to trigger a component refresh after updating a book (assuming from parent component).
 *
 * @returns {JSX.Element} The rendered edit book modal component.
 */

interface IUpdateBookProps {
  selectedItem: IBooksItem;
  showUpdateBookModal: boolean;
  setShowUpdateBookModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function EditBookModal({
  setRefreshComponent,
  setShowUpdateBookModal,
  showUpdateBookModal,
  selectedItem
}: IUpdateBookProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<IAddBookForm>({
    defaultValues: {
      name: '',
      author: '',
      description: '',
      price: null,
      coverPhoto: '',
      audioFile: null,
      pdfFile: null,
      showOnFirstScreen: null
    },
    mode: 'onChange'
  });

  const {
    id,
    name,
    author,
    description,
    price,
    coverPhoto,
    audioFile,
    pdfFile,
    showOnFirstScreen
  } = selectedItem;

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  const [covertPhotoFileList, setCovertPhotoFileList] = useState<any>([]);
  const [pdfFileList, setPdfFileList] = useState<any>([]);
  const [audioFileList, setAudioFileList] = useState<any>([]);
  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Book modal.
        setShowUpdateBookModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBookForm> = async (data: IAddBookForm) => {
    setIsFormSubmiting(true);
    console.log(data);

    try {
      const payload = {
        id,
        name: data.name,
        author: data.author,
        description: data.description,
        price: data.price,
        showOnFirstScreen: Boolean(data.showOnFirstScreen),
        coverPhoto: data?.coverPhoto
          ? data?.coverPhoto
          : covertPhotoFileList[0]?.id ?? null,
        audioFile: data?.audioFile ? data?.audioFile : null,
        pdfFile: data?.pdfFile ? data?.pdfFile : null
      };

      const res: IGlobalResponse = await BooksServices.getInstance().updateBook(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.isSuccess) {
        toast.success(t('successTxt'));
        setShowUpdateBookModal(false);
        setRefreshComponent(z => !z);
      }
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('An error occurred:', error);
    } finally {
      // Whether success or failure, set isFormSubmitting to false and close the modal
      setIsFormSubmiting(false);
      setShowUpdateBookModal(false);
    }
  };

  const reFetchTokenizedFiles = async (
    coverPhotoId: string,
    pdfId: string,
    audioId: string
  ) => {
    if (coverPhotoId) {
      try {
        const res = await tokenizeImage(coverPhotoId);
        setCovertPhotoFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
    if (pdfId) {
      try {
        const res = await tokenizeImage(pdfId);
        setPdfFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
    if (audioId) {
      try {
        const res = await tokenizeImage(audioId);
        setAudioFileList([res]);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    setValue('name', name ?? '');
    setValue('author', author ?? '');
    setValue('description', description ?? '');
    setValue('price', price ?? '');
    setValue('showOnFirstScreen', showOnFirstScreen ?? '');
    setValue('coverPhoto', coverPhoto?.id ?? null);
    // setValue('audioFile', audioFile?.id ?? null);
    setValue('pdfFile', pdfFile?.id ?? null);
  }, []);

  useEffect(() => {
    reFetchTokenizedFiles(coverPhoto, pdfFile, audioFile);
  }, [selectedItem]);

  return (
    <Modal
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={t('updateBook')}
      open={showUpdateBookModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="update-book-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isFormSubmiting}
          loading={isFormSubmiting}
        >
          {t('save')}
        </AppHandledButton>
      ]}
    >
      <Form
        id="update-book-modal-form"
        layout="vertical"
        className="updatePordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-10">
              <AppHandledInput
                label={t('name')}
                name="name"
                inputProps={{
                  id: 'Name'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('name'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('name'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('name'))}
                errors={errors}
              />
            </div>
            <div className="pb-10">
              <AppHandledInput
                label={t('author')}
                name="author"
                inputProps={{
                  id: 'Author'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('author'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('author'), '3')
                  }
                }}
                required
                control={control}
                inputType="text"
                placeholder={inputPlaceholderText(t('author'))}
                errors={errors}
              />
            </div>
            <div className="pb-10">
              <AppHandledTextArea
                label={t('description')}
                name="description"
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('description'))
                  },
                  minLength: {
                    value: 3,
                    message: minLengthCheck(t('description'), '3')
                  }
                }}
                required
                control={control}
                placeholder={inputPlaceholderText(t('description'))}
                errors={errors}
                textareaProps={{
                  size: 'large',
                  rows: 4
                }}
              />
            </div>
            <div className="pb-10">
              <AppHandledInput
                label={t('price')}
                name="price"
                inputProps={{
                  id: 'Price'
                }}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText(t('price'))
                  }
                }}
                required
                control={control}
                inputType="number"
                placeholder={inputPlaceholderText(t('price'))}
                errors={errors}
              />
            </div>
            <div className="pb-10">
              <AppHandledCheckbox
                label={t('showOnFirstScreen')}
                defaultValue={showOnFirstScreen}
                name="showOnFirstScreen"
                control={control}
                errors={errors}
                formItemProps={{
                  labelCol: { span: 7 },
                  wrapperCol: { span: 17 }
                }}
              />
            </div>
            <div className="pb-10">
              <Form.Item label={t('coverPhoto')}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={t('bookPhoto')}
                  accept=".jpg, .jpeg, .png, .webp"
                  length={1}
                  defaultFileList={covertPhotoFileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;
                      fileData && setValue('coverPhoto', fileData?.id);
                    } else {
                      setValue('coverPhoto', null);
                    }
                  }}
                  folderType={2}
                />
              </Form.Item>
            </div>
            <div className="pb-10">
              <Form.Item label={t('uploadAudio')}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={t('uploadAudio')}
                  accept=".mp3, .mpeg"
                  length={1}
                  defaultFileList={audioFileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData =
                        selectedFile?.response?.data ?? selectedFile;

                      fileData && setValue('audioFile', fileData?.id);
                    } else {
                      setValue('audioFile', null);
                    }
                  }}
                  folderType={3}
                />
              </Form.Item>
            </div>

            <div className="pb-10">
              <Form.Item label={t('uploadPdf')}>
                <AppFileUpload
                  listType="picture-card"
                  photoLabel={t('uploadPdf')}
                  accept=".pdf"
                  length={1}
                  defaultFileList={pdfFileList}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData =
                        selectedFile?.response?.data ?? selectedFile;
                      fileData && setValue('pdfFile', fileData?.id);
                    } else {
                      setValue('pdfFile', null);
                    }
                  }}
                  folderType={1}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditBookModal;

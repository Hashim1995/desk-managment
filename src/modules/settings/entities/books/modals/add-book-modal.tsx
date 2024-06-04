import { Dispatch, SetStateAction, useState } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { useReadLocalStorage } from 'usehooks-ts';

import { IGlobalResponse } from '@/models/common';
import { BooksServices } from '@/services/books-services/books-service';
import { toast } from 'react-toastify';

import { languagesOptions } from '@/utils/constants/options';
import AppHandledButton from '@/components/display/button/handle-button';
import AppHandledSelect from '@/components/forms/select/handled-select';
import AppHandledInput from '@/components/forms/input/handled_input';
import AppHandledTextArea from '@/components/forms/text-area/handled-text-area';
import AppFileUpload from '@/components/forms/file-upload/file-upload';
import AppHandledCheckbox from '@/components/forms/checkbox/handled-checkbox';
import { useTranslation } from 'react-i18next';
import { IAddBookForm } from '../models';

/**
 * @component
 * @example
 * ```jsx
 * import AddBookModal from './AddBookModal';
 *
 * function MyComponent() {
 *   const [showAddBookModal, setShowAddBookModal] = useState(false);
 *   const [refreshComponent, setRefreshComponent] = useState(false);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setShowAddBookModal(true)}>Add Book</button>
 *       {showAddBookModal && (
 *         <AddBookModal
 *           showAddBookModal={showAddBookModal}
 *           setShowAddBookModal={setShowAddBookModal}
 *           setRefreshComponent={setRefreshComponent}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * Renders a modal for adding a new book.
 *
 * @prop {boolean} showAddBookModal - Flag indicating whether the modal is visible.
 * @prop {Dispatch<SetStateAction<boolean>>} setShowAddBookModal - Callback function to control the modal's visibility.
 * @prop {Dispatch<SetStateAction<boolean>>} setRefreshComponent - Callback function to trigger a component refresh after adding a book.
 *
 * @returns {JSX.Element} The rendered add book modal component.
 */

interface IAddBookProps {
  showAddBookModal: boolean;
  setShowAddBookModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
}

function AddBookModal({
  setRefreshComponent,
  setShowAddBookModal,
  showAddBookModal
}: IAddBookProps) {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue
  } = useForm<IAddBookForm>({
    defaultValues: {
      name: '',
      author: '',
      description: '',
      price: null,
      coverPhoto: '',
      audioFile: null,
      pdfFile: null,
      showOnFirstScreen: false,
      language: languagesOptions[0]
    },
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');
  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);

  const handleClose = () => {
    console.log('aaa');
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        // If the user confirms closing, hide the add Book modal.
        setShowAddBookModal(false);
      }
    });
  };

  const onSubmit: SubmitHandler<IAddBookForm> = async (data: IAddBookForm) => {
    setIsFormSubmiting(true);

    // Create a payload object by extracting values from the data object, providing default values if they are undefined.
    const payload = {
      name: data.name,
      author: data.author,
      description: data.description,
      price: data.price,
      coverPhoto: data.coverPhoto,
      audioFile: data.audioFile,
      pdfFile: data.pdfFile,
      showOnFirstScreen: data.showOnFirstScreen,
      language:
        typeof data?.language === 'object' && data.language !== null
          ? data.language.value
          : data.language
    };

    // Call the service to add a new country member and receive a response.
    const res: IGlobalResponse = await BooksServices.getInstance().addBook(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res.isSuccess) {
      // If the country member is successfully added, show a success toast message, hide the add country modal, and trigger a component refresh.
      toast.success(t('successTxt'));
      setShowAddBookModal(false);
      // Trigger a component refresh by toggling the `refreshComponent` state.
      setRefreshComponent(z => !z);
    }
    // If the country member is not successfully added, hide the add country modal and set isFormSubmitting to false.
    setShowAddBookModal(false);
    setIsFormSubmiting(false);
  };

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={t('addBook')}
      open={showAddBookModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-book-modal-form"
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
        id="add-book-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={3}>
            <AppHandledSelect
              label={t('language')}
              name="language"
              required
              control={control}
              errors={errors}
              selectProps={{
                // defaultValue: languagesOptions[0],
                id: 'language',
                className: 'w-full',
                options: languagesOptions
              }}
            />
          </Col>
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
                  photoLabel={'bookPhoto'}
                  accept=".jpg, .jpeg, .png, .webp"
                  length={1}
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
                  accept=".mp3"
                  length={1}
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;

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
                  getValues={(e: UploadFile[]) => {
                    if (e && e.length > 0) {
                      const selectedFile = e[0];
                      const fileData = selectedFile?.response?.data;
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

export default AddBookModal;

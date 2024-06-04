import React, { useEffect, useState } from 'react';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type {
  UploadFile,
  UploadListType,
  UploadProps
} from 'antd/es/upload/interface';
import TokenizedImage from '@/components/display/image/tokenized_image';

import { convertBytesToReadableSize } from '@/utils/functions/functions';
import ViewFileModal from '@/components/display/view-file-modal/view-file-modal';
import { toast } from 'react-toastify';
import { useReadLocalStorage } from 'usehooks-ts';
import AppHandledButton from '@/components/display/button/handle-button';
import { useTranslation } from 'react-i18next';

/**
 * A custom upload component that integrates with Ant Design's Upload component for file uploads with size, dimension, and preview functionalities.
 *
 * @param {IProps} props - Component properties
 * @param {UploadListType} props.listType - The type of upload list display (e.g., 'picture', 'text').
 * @param {string} [props.accept] - A string of accepted file types (e.g., 'image/jpeg, image/png').
 * @param {function} props.getValues - A callback function to provide the updated file list to the parent component.
 * @param {number} [props.length=5] - The maximum number of files allowed for upload.
 * @param {string} [props.loadingText] - Custom text to display while uploading.
 * @param {object} [props.size] - Size restrictions for uploaded files.
 * @param {object} [props.size.max] - Maximum allowed file size in bytes.
 * @param {string} [props.size.maxErrorText] - Custom error message for exceeding max size.
 * @param {object} [props.size.min] - Minimum allowed file size in bytes.
 * @param {string} [props.size.minErrorText] - Custom error message for file size below minimum.
 * @param {object} [props.dimension] - Dimension restrictions for uploaded images.
 * @param {number} [props.dimension.width] - Maximum allowed image width in pixels.
 * @param {number} [props.dimension.height] - Maximum allowed image height in pixels.
 * @param {string} [props.dimension.errorText] - Custom error message for exceeding image dimensions.
 * @param {UploadFile[]} [props.defaultFileList] - An initial list of files to display.
 * @param {'common' | 'avatar'} [props.imgType='common'] - Type of image being uploaded (common or avatar).
 * @param {string} [props.photoLabel] - Label displayed in the preview modal for images.
 * @param {boolean} [props.isProfile] - Flag indicating if the upload is for a profile picture.
 *
 * @returns {JSX.Element} - The rendered upload component with functionality for selecting, uploading, and previewing files.
 *
 * @example Usage with a form
 *
 * ```jsx
 * import React, { useState } from 'react';
 * import AppFileUpload from './AppFileUpload';
 *
 * function MyForm() {
 *   const [fileList, setFileList] = useState([]);
 *
 *   const handleGetValues = (updatedFileList) => {
 *     setFileList(updatedFileList);
 *   };
 *
 *   return (
 *     <form>
 *       <AppFileUpload
 *         listType="picture"
 *         getValues={handleGetValues}
 *         length={3}
 *         size={{ max: 5242880 }} // 5MB max size
 *         dimension={{ width: 1920, height: 1080 }} // Max 1920x1080 resolution
 *         folderType={1} // Replace with your folder type for uploads
 *         photoLabel="Profile Picture"
 *         isProfile
 *       />
 *       {fileList.length > 0 && <p>Selected files: {fileList.length}</p>}
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 *
 * export default MyForm;
 * ```
 */

interface IProps {
  listType: UploadListType;
  accept?: string;
  getValues: any;
  length?: number;
  folderType: number;
  loadingText?: string;
  size?: {
    max?: number;
    min?: number;
    maxErrorText?: string;
    minErrorText?: string;
  };
  dimension?: {
    width?: number;
    height?: number;
    errorText?: string;
  };
  defaultFileList?: any;
  isProfile?: boolean;
  imgType?: 'common' | 'avatar';
  photoLabel?: string;
}

function AppFileUpload({
  listType,
  accept,
  getValues,
  length = 5,
  loadingText,
  size,
  dimension,
  folderType,
  defaultFileList,
  imgType = 'common',
  photoLabel,
  isProfile
}: IProps) {
  const { t } = useTranslation();
  const { token } = JSON.parse(localStorage.getItem('userToken') || '{}');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>('');
  // const [previewTitle, setPreviewTitle] = useState('');
  const darkMode = useReadLocalStorage('darkTheme');
  const handleCancel = () => {
    setPreviewOpen(false);
  };
  const [fileList, setFileList] = useState<any[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (file?.response?.Data) {
      setPreviewImage(file?.response?.Data);

      // setPreviewTitle(file.response.Data.name);
    } else if (file) {
      setPreviewImage(file);
      // setPreviewTitle(file.name);
    }

    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const allahaxoshgetsin = newFileList?.filter(item => item.status);
    setFileList(allahaxoshgetsin);
    getValues(allahaxoshgetsin);
  };

  const uploadButton = (
    <div className={`${listType === 'text' ? 'textTypeFileUpload' : ''}`}>
      <PlusOutlined rev={undefined} />
      <div style={{ fontSize: '12px', marginTop: listType === 'text' ? 0 : 6 }}>
        Seçin və ya sürüşdürün
      </div>
    </div>
  );

  const promise = (file: any) =>
    new Promise(resolve => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const { width, height } = img;
        if (
          (dimension?.width && width > dimension?.width) ||
          (dimension?.height && height > dimension?.height)
        ) {
          toast.error(
            dimension?.errorText || `Resolution must be max  ${width}x${height}`
          );
          resolve(false);
        } else {
          resolve(true);
        }
      };
    });

  useEffect(() => {
    setFileList(defaultFileList);
  }, [defaultFileList]);

  useEffect(() => {
    getValues(fileList);
  }, [fileList]);

  return (
    <>
      <div
        style={
          isProfile
            ? {
                background: 'transparent',
                border: 'none'
              }
            : {
                background: 'rgba(0, 0, 0, 0.02)',
                padding: 10,
                border: darkMode ? '1px dashed #d9d9d968' : '1px dashed #d9d9d9'
              }
        }
      >
        <Upload
          beforeUpload={async file => {
            if (size?.max && file.size > size.max) {
              toast.error(
                size?.maxErrorText ||
                  `Max size must be ${convertBytesToReadableSize(size.max)} `
              );
              return false;
            }
            if (size?.min && file.size <= size.min) {
              toast.error(
                size?.minErrorText ||
                  `Min size must be ${convertBytesToReadableSize(size.min)} `
              );
              return false;
            }

            if (dimension) {
              const res = await promise(file);
              if (!res) {
                return false;
              }
            }

            return true;
          }}
          className="antd-upload-width"
          listType={listType}
          showUploadList={{
            showPreviewIcon: false,
            showDownloadIcon: true,
            downloadIcon: <EyeOutlined rev={undefined} />
          }}
          onDownload={handlePreview}
          fileList={fileList}
          onRemove={file => {
            const updatedFileList = fileList?.filter(
              item => item?.uid !== file?.uid
            );
            setFileList(updatedFileList);
          }}
          locale={{
            uploading: loadingText || 'yüklənir...',
            previewFile: 'Önizləmə'
          }}
          onPreview={handlePreview}
          onChange={handleChange}
          accept={accept}
          action={`${import.meta.env.VITE_BASE_URL}/FileUpload/${folderType}`}
          headers={{
            Authorization: `Bearer ${token}`
          }}
        >
          {fileList?.length >= length ? null : uploadButton}
        </Upload>
      </div>

      {previewImage?.mimeType === 'image/jpeg' ||
      previewImage?.type === 'image/jpeg' ? (
        <Modal
          open={previewOpen}
          title={photoLabel}
          footer={null}
          onCancel={handleCancel}
          destroyOnClose
          className="generalModal"
        >
          <TokenizedImage
            tokenized
            imgType={imgType}
            style={{ width: '100%', height: '500px' }}
            src={previewImage?.fileUrl ?? previewImage?.response?.data?.fileUrl}
          />
        </Modal>
      ) : (
        <Modal
          open={previewOpen}
          onCancel={handleCancel}
          destroyOnClose
          width={992}
          cancelText={t('closeBtn')}
          okText={t('save')}
          className="generalModal"
          footer={[
            <AppHandledButton onClick={handleCancel}>
              {t('closeBtn')}
            </AppHandledButton>
          ]}
        >
          <ViewFileModal src={previewImage} />
        </Modal>
      )}
    </>
  );
}

export default AppFileUpload;

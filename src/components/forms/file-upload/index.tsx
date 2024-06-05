import React, { useEffect, useState } from 'react';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type {
  UploadFile,
  UploadListType,
  UploadProps
} from 'antd/es/upload/interface';
import TokenizedImage from '@/components/display/image';

import { convertBytesToReadableSize } from '@/utils/functions/functions';
import { toast } from 'react-toastify';
import { useReadLocalStorage } from 'usehooks-ts';
import { t } from 'i18next';

interface IProps {
  listType: UploadListType;
  accept?: string;
  getValues: any;
  length?: number;
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
}

function AppFileUpload({
  listType,
  accept,
  getValues,
  length = 5,
  loadingText,
  size,
  dimension,
  defaultFileList,
  imgType = 'common',
  isProfile
}: IProps) {
  const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
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
    setFileList(newFileList.filter(item => item.status));
    getValues(fileList);
  };

  const uploadButton = (
    <div className={`${listType === 'text' ? 'textTypeFileUpload' : ''}`}>
      <PlusOutlined rev={undefined} />
      <div style={{ fontSize: '12px', marginTop: listType === 'text' ? 0 : 6 }}>
        {t('dragOrSelect')}
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
          listType={listType}
          showUploadList={{
            showPreviewIcon: false,
            showDownloadIcon: true,
            downloadIcon: <EyeOutlined rev={undefined} />
          }}
          onDownload={handlePreview}
          fileList={fileList}
          onRemove={file => {
            const updatedFileList = fileList.filter(
              item => item.uid !== file.uid
            );
            setFileList(updatedFileList);
          }}
          locale={{ uploading: loadingText || 'Yüklənir...' }}
          onPreview={handlePreview}
          onChange={handleChange}
          accept={accept}
          action={`${import.meta.env.VITE_BASE_URL}Files`}
          headers={{
            Authorization: `Bearer ${userToken?.token}`
          }}
        >
          {fileList?.length >= length ? null : uploadButton}
        </Upload>
      </div>

      <Modal
        open={previewOpen}
        title={t('photo')}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        className="generalModal"
      >
        <TokenizedImage
          tokenized
          imgType={imgType}
          style={{ width: '100%' }}
          src={previewImage?.response?.id}
        />
      </Modal>
      {/* {previewImage?.response?.id !== 'application/pdf' ? (
        <Modal
          open={previewOpen}
          title={t('photo')}
          footer={null}
          onCancel={handleCancel}
          destroyOnClose
          className="generalModal"
        >
          <TokenizedImage
            tokenized
            imgType={imgType}
            style={{ width: '100%' }}
            src={previewImage?.fileUrl}
          />
        </Modal>
      ) : (
        <Modal
          open={previewOpen}
          title={t('viewDoc')}
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
      )} */}
    </>
  );
}

export default AppFileUpload;

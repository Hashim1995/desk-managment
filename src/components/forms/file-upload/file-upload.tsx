import React, { Dispatch, SetStateAction } from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

interface IProps {
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileList: UploadFile[];
}
function AppFileUploadNew({ setFileList, fileList }: IProps) {
  // const [fileList, setFileList] = useState<UploadFile[]>([
  //   {
  //     uid: '-1',
  //     name: 'image.png',
  //     status: 'done',
  //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
  //   }
  // ]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as any);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Upload
      beforeUpload={() => false}
      // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture-card"
      fileList={fileList}
      onChange={onChange}
      onPreview={onPreview}
    >
      {fileList.length < 1 && '+ Upload'}
    </Upload>
  );
}

export default AppFileUploadNew;

import { Col, Row, Space, theme, Typography } from 'antd';
import TokenizedIframe from '@/components/display/iframe/tokenized-iframe';
import dayjs from 'dayjs';
import { convertBytesToReadableSize } from '@/utils/functions/functions';
import { useTranslation } from 'react-i18next';

/**
 * A modal component for viewing files, displaying file details and rendering the file content within an iframe.
 * @param {Object} props - Props for the ViewFileModal component.
 * @param {any} props.src - The source object containing file information.
 * @returns {JSX.Element} - JSX element representing the ViewFileModal component.
 *
 * @example
 * Usage example
 * import React from 'react';
 * import ViewFileModal from './ViewFileModal';
 *
 * function ExampleComponent() {
 *   const fileSrc = {
 *     name: 'example.pdf',
 *     size: 1024, // size in bytes
 *     uploadDate: new Date(),
 *     fileUrl: 'https://example.com/example.pdf' // URL to the file
 *   };
 *
 *   return (
 *     <div>
 *       <ViewFileModal src={fileSrc} />
 *     </div>
 *   );
 * }
 *
 * export default ExampleComponent;
 */

const { Text } = Typography;

function ViewFileModal({ src }: { src: any }) {
  const { t } = useTranslation();

  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Row style={{ paddingTop: token.padding, paddingBottom: token.padding }}>
      <Col span={5}>
        <Space direction="vertical">
          <div>
            <div>
              <Text type="secondary">{t('fileName')}</Text>
            </div>
            <div>
              <Text>{src?.name}</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">{t('fileSize')}</Text>
            </div>
            <div>
              <Text>{convertBytesToReadableSize(src?.size)}</Text>
            </div>
          </div>
          <div>
            <div>
              <Text type="secondary">{t('date')}</Text>
            </div>
            <div>
              <Text>
                {dayjs(src?.uploadDate).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
          </div>
        </Space>
      </Col>
      <Col span={1} />
      <Col span={18}>
        <TokenizedIframe
          style={{ height: 450 }}
          className="w-full"
          src={src?.fileUrl}
          tokenized
        />
      </Col>
    </Row>
  );
}

export default ViewFileModal;

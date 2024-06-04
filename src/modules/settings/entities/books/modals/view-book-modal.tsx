import TokenizedImage from '@/components/display/image/tokenized_image';
import { getLanguageName } from '@/utils/functions/functions';
import { Button, Card, Col, Modal, Row, Typography } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { IBooksItem } from '../models';

/**
 * Renders a modal for viewing book details.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {IBooksItem} props.selectedItem - The book object to be viewed.
 * @param {boolean} props.showViewBookModal - Flag indicating whether the modal is visible.
 * @param {Dispatch<SetStateAction<boolean>>} props.setShowViewBookModal - Callback function to control the modal's visibility.
 *
 * @returns {JSX.Element} The rendered view book modal component.
 */

interface IViewBookProps {
  selectedItem: IBooksItem;
  showViewBookModal: boolean;
  setShowViewBookModal: Dispatch<SetStateAction<boolean>>;
}

function ViewBook({
  setShowViewBookModal,
  selectedItem,
  showViewBookModal
}: IViewBookProps) {
  const { Text, Title } = Typography;
  const handleClose = () => {
    setShowViewBookModal(false);
  };

  const {
    author,
    // image
    description,
    coverPhoto,
    isActive,
    name,
    price,
    language,
    showOnFirstScreen
  } = selectedItem;

  const { t } = useTranslation();

  return (
    <Modal
      width={700}
      destroyOnClose
      style={{ top: 20 }}
      title={t('book')}
      open={showViewBookModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <Button type="default" key="cancel" onClick={handleClose}>
          {t('closeBtn')}
        </Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <TokenizedImage
            useCach
            tokenized
            imgType="common"
            preview
            style={{ width: 672, height: 300, objectFit: 'cover' }}
            src={coverPhoto?.fileUrl ?? null}
          />
        </Col>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title className="m-0" level={3}>
                  {name ?? t('noDataText')}
                </Title>
              </Col>
              <Col span={24}>
                <Text type="secondary" strong>
                  {t('author')}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {author ?? t('noDataText')}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {t('price')}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {' '}
                  {price ?? t('noDataText')} AZN{' '}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {t('language')}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {typeof language === 'number'
                    ? getLanguageName(language)
                    : t('noDataText')}
                </Text>
              </Col>

              {!isActive && (
                <Col span={24}>
                  <Text type="secondary" strong>
                    {t('status')}:
                  </Text>
                  <Text style={{ marginLeft: 8 }}>{t('deactivated')}</Text>
                </Col>
              )}

              <Col span={24}>
                <Text type="secondary" strong>
                  {t('showOnFirstScreen')}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {showOnFirstScreen ? t('yesTxt') : t('noTxt')}
                </Text>
              </Col>

              <Col span={24}>
                <Text type="secondary" strong>
                  {t('description')}:
                </Text>
                <Text style={{ marginLeft: 8 }}>
                  {description ?? t('noDataText')}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewBook;

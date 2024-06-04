import {
  Row,
  Col,
  Card,
  Descriptions,
  Typography,
  Dropdown,
  MenuProps,
  theme,
  Grid
} from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import { MoreOutlined } from '@ant-design/icons';
import { ButtonConfig, IEdcListItem } from '@/modules/rooms/models';
// import { noDataText } from '@/utils/constants/texts';
import AppTag from '@/components/feedback/tag/tag';
import { useNavigate } from 'react-router-dom';
import { EdcServies } from '@/services/edc-services/edc-services';

import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';
import { toCapitalize } from '@/utils/functions/functions';
import { toastOptions } from '@/configs/global-configs';
import AppHandledButton from '@/components/display/button/handle-button';
import { useTranslation } from 'react-i18next';

interface IEdcListItemCardProps extends IEdcListItem {
  setSelectedItem?: Dispatch<SetStateAction<null | IEdcListItem>>;
  handleModalVisibility?: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent?: Dispatch<SetStateAction<boolean>>;
  setShowRejectForm?: Dispatch<SetStateAction<boolean>>;
  setShowReturnForm?: Dispatch<SetStateAction<boolean>>;
  setShowSelectTemplatesForDocumentForm?: Dispatch<SetStateAction<boolean>>;
}

function EdcListItemCard(props: IEdcListItemCardProps) {
  const {
    Id,
    DocumentType,
    DocumentCode,
    RecieverLegalEntity,
    RecieverLegalEntityVoen,
    SenderLegalEntity,
    SenderLegalEntityVoen,
    DocumentStatusId,
    DocumentTypeId,
    // permission,
    isDraft,
    setSelectedItem,
    handleModalVisibility,
    setRefreshComponent,
    setShowRejectForm,
    setShowReturnForm,
    setShowSelectTemplatesForDocumentForm,
    CanDelete,
    CanSign,
    CanVerify,
    CanReturn,
    CanReject,
    CanEdit,
    CanSelectCirculation
    // ForInfo,
    // AlertClosed,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Initialize useBreakpoint hook from Ant Design Grid
  const { useBreakpoint } = Grid;
  const { lg } = useBreakpoint();

  // Define a function to handle document approval
  const approveDoc = async () => {
    if (Id) {
      const res = await EdcServies.getInstance().approveDoc(Id);
      if (res.isSuccess) {
        setRefreshComponent && setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
      } else {
        setRefreshComponent && setRefreshComponent(z => !z);
      }
    }
  };

  // Define a function to handle document signing
  const signDoc = async () => {
    if (Id) {
      const res = await EdcServies.getInstance().signDoc(Id);
      if (res.isSuccess) {
        setRefreshComponent && setRefreshComponent(z => !z);
        toast.success(res.Data?.message, toastOptions);
      } else {
        setRefreshComponent && setRefreshComponent(z => !z);
      }
    }
  };

  // Initialize actions array for dropdown menu items
  const actions: MenuProps['items'] = [
    {
      label: <Typography.Text>{toCapitalize(t('view'))}</Typography.Text>,
      key: ButtonConfig.viewButton
    }
  ];

  // Define a function to dynamically generate menu items based on user permissions
  const generateMenuItems = () => {
    if (CanEdit) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('editBtn'))}</Typography.Text>,
        key: ButtonConfig.editButton
      });
    }

    if (CanDelete) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('delete'))}</Typography.Text>,
        key: ButtonConfig.deleteButton
      });
    }

    if (CanVerify) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('confirm'))}</Typography.Text>,
        key: ButtonConfig.approveButton
      });
    }

    if (CanReject) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('reject'))}</Typography.Text>,
        key: ButtonConfig.rejectButton
      });
    }

    if (CanReturn) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('sendBack'))}</Typography.Text>,
        key: ButtonConfig.returnButton
      });
    }

    if (CanSign) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('canSign'))}</Typography.Text>,
        key: ButtonConfig.signButton
      });
    }

    if (CanSelectCirculation) {
      actions.push({
        label: <Typography.Text>{toCapitalize(t('send'))}</Typography.Text>,
        key: ButtonConfig.sendButton
      });
    }
  };

  generateMenuItems();

  // Define a function to handle menu item clicks
  const handleMenuClick: MenuProps['onClick'] = e => {
    if (e.key === '0') {
      if (DocumentTypeId === 1) {
        isDraft
          ? navigate(`/edc/update-contract/draft/${Id}`)
          : navigate(`/edc/update-contract/${Id}`);
      }
      if (DocumentTypeId === 2) {
        isDraft
          ? navigate(`/edc/update-addition/draft/${Id}`)
          : navigate(`/edc/update-addition/${Id}`);
      }
      if (DocumentTypeId === 3) {
        isDraft
          ? navigate(`/edc/update-invoice/draft/${Id}`)
          : navigate(`/edc/update-invoice/${Id}`);
      }
      if (DocumentTypeId === 4) {
        isDraft
          ? navigate(`/edc/update-act/draft/${Id}`)
          : navigate(`/edc/update-act/${Id}`);
      }
    }
    if (e.key === '1') {
      if (setSelectedItem) setSelectedItem({ Id, isDraft });
      if (handleModalVisibility) handleModalVisibility(true);
    }
    if (e.key === '2') {
      if (DocumentTypeId === 1) {
        isDraft
          ? navigate(`/edc/view-contract/draft/${Id}`)
          : navigate(`/edc/view-contract/${Id}`);
      }
      if (DocumentTypeId === 2) {
        isDraft
          ? navigate(`/edc/view-addition/draft/${Id}`)
          : navigate(`/edc/view-addition/${Id}`);
      }
      if (DocumentTypeId === 3) {
        isDraft
          ? navigate(`/edc/view-invoice/draft/${Id}`)
          : navigate(`/edc/view-invoice/${Id}`);
      }
      if (DocumentTypeId === 4) {
        isDraft
          ? navigate(`/edc/view-act/draft/${Id}`)
          : navigate(`/edc/view-act/${Id}`);
      }
    }
    if (e.key === '3') {
      approveDoc();
    }
    if (e.key === '4') {
      setSelectedItem && setSelectedItem(props);
      setShowRejectForm && setShowRejectForm(true);
    }
    if (e.key === '5') {
      setSelectedItem && setSelectedItem(props);
      setShowReturnForm && setShowReturnForm(true);
    }
    if (e.key === '6') {
      signDoc();
    }
    if (e.key === '7') {
      setSelectedItem && setSelectedItem(props);
      setShowSelectTemplatesForDocumentForm &&
        setShowSelectTemplatesForDocumentForm(true);
      // sendDoc();
    }
  };

  // Define properties for the dropdown menu
  const menuProps = {
    items: actions,
    onClick: handleMenuClick
  };

  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Card
      style={{
        boxShadow: token.boxShadow,
        padding: token.paddingXS
      }}
    >
      <Row gutter={16}>
        <Col
          style={{
            borderRight: `1px solid ${token.colorBorderSecondary}`
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('documentType')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: DocumentType ?? t('noDataText')
                }}
                strong
              >
                {DocumentType ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('documentNumber')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: DocumentCode ?? t('noDataText')
                }}
                strong
              >
                {DocumentCode ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: lg ? `1px solid ${token.colorBorderSecondary}` : 'none'
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('receivingLegalEntity')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: RecieverLegalEntity ?? t('noDataText')
                }}
                strong
              >
                {RecieverLegalEntity ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('receivingLegalEntityVAT')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: RecieverLegalEntityVoen ?? t('noDataText')
                }}
                strong
              >
                {RecieverLegalEntityVoen ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: `1px solid ${token.colorBorderSecondary}`
          }}
          md={12}
          lg={6}
          xl={6}
        >
          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('sendingLegalEntity')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 2,
                  tooltip: SenderLegalEntity ?? t('noDataText')
                }}
                strong
              >
                {SenderLegalEntity ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>

          <Descriptions size="small" layout="vertical">
            <DescriptionsItem
              labelStyle={{
                fontSize: token.fontSizeSM
              }}
              label={t('sendingLegalEntityVAT')}
            >
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  tooltip: SenderLegalEntityVoen ?? t('noDataText')
                }}
                strong
              >
                {SenderLegalEntityVoen ?? t('noDataText')}
              </Typography.Paragraph>
            </DescriptionsItem>
          </Descriptions>
        </Col>
        <Col
          style={{
            borderRight: lg ? `1px solid ${token.colorBorderSecondary}` : 'none'
          }}
          md={6}
          lg={4}
          xl={4}
        >
          <div className="h-full center">
            <AppTag id={DocumentStatusId} />
            {/* <Tag
              style={{
                fontSize: token.fontSizeSM,
                padding: token.paddingXS
              }}
              color="warning"
            >
              {DocumentStatus?.toLocaleUpperCase('tr-TR') ??
                noDataText?.toLocaleUpperCase('tr-TR')}
            </Tag> */}
          </div>
        </Col>
        <Col md={6} lg={2} xl={2}>
          <div
            className="h-full center"
            style={{ alignItems: !lg ? 'start' : 'center' }}
          >
            <Dropdown menu={menuProps} trigger={['click']}>
              <AppHandledButton icon={<MoreOutlined rev={undefined} />} />
            </Dropdown>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default EdcListItemCard;

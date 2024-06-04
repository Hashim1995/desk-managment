import { Alert, Modal } from 'antd';
import { useCallbackPrompt } from '@/utils/functions/useCallbackPrompt';
import { useTranslation } from 'react-i18next';

interface IAppRouteBlocker {
  open: boolean;
}

function AppRouteBlocker({ open }: IAppRouteBlocker) {
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(open);

  const { t } = useTranslation();

  const a = () => {
    if (typeof confirmNavigation === 'function') {
      confirmNavigation(); // Call the function if it's a function
    }
  };

  const b = () => {
    if (typeof cancelNavigation === 'function') {
      cancelNavigation(); // Call the function if it's a function
    }
  };

  return (
    <div>
      <Modal
        title={t('warning')}
        visible={Boolean(showPrompt)}
        onOk={a}
        onCancel={b}
        okText={t('yesTxt')}
        cancelText={t('noTxt')}
      >
        <Alert
          message={t('dataWillBeDeleted')}
          description={t('unsavedChanges')}
          type="error"
          showIcon
        />
      </Modal>
    </div>
  );
}

export default AppRouteBlocker;

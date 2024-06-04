import React from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  visible,
  onOk,
  onCancel
}: DeleteConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('confirmTitle')}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={t('yesTxt')}
      okType="danger"
      cancelText={t('noTxt')}
    >
      <p>{t('confirmDelete')}</p>
    </Modal>
  );
}

export default DeleteConfirmationModal;

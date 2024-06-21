/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Col, Form, Modal, Row, UploadFile } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useReadLocalStorage } from 'usehooks-ts';

import {
  inputPlaceholderText,
  inputValidationText,
  minLengthCheck,
  selectPlaceholderText,
  showCloseConfirmationModal
} from '@/utils/functions/functions';
import { StaffService } from '@/services/staff-services/staff-services';
import AppHandledInput from '@/components/forms/input/handled-input';

import AppHandledButton from '@/components/display/button/handle-button';
import AppFileUpload from '@/components/forms/file-upload';
import { ICreateBook } from '../types';
import AppHandledDate from '@/components/forms/date/handled-date';
import AppHandledSelect from '@/components/forms/select/handled-select';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import dayjs from 'dayjs';

interface IAddBookingProps {
  showAddBookingModal: boolean;
  setShowAddBookingModal: Dispatch<SetStateAction<boolean>>;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  roomsList: { name: string; id: number }[];
  ownersList: { name: string; id: number }[];
}

function AddBookingModal({
  setRefreshComponent,
  setShowAddBookingModal,
  showAddBookingModal,
  roomsList,
  ownersList
}: IAddBookingProps) {
  const {
    setValue,
    watch,
    formState: { errors, isSubmitting },
    control,
    handleSubmit
  } = useForm<ICreateBook>({
    mode: 'onChange'
  });

  const { t } = useTranslation();
  const darkMode = useReadLocalStorage('darkTheme');
  const [desksList, setDesksList] = useState<{ name: string; id: number }[]>(
    []
  );
  const handleClose = () => {
    showCloseConfirmationModal({
      isDark: Boolean(darkMode),
      onClose: () => {
        setShowAddBookingModal(false);
      }
    });
  };

  async function onSubmit(data: ICreateBook) {
    const payload: ICreateBook = {
      deskId: data?.deskId,
      userId: data?.userId,
      roomId: data?.roomId,
      startDate: dayjs(data?.startDate).format('YYYY-MM-DDTHH:mm'), // Local time as ISO string
      endDate: dayjs(data?.endDate).format('YYYY-MM-DDTHH:mm') // Local time as ISO string
    };
    try {
      const res = await RoomsService.getInstance().createBooking(payload);
      if (res) {
        setRefreshComponent(z => !z);
        setShowAddBookingModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getLists() {
    try {
      const res = await RoomsService.getInstance().getDesksComboList([
        { name: 'roomId', value: watch('roomId') }
      ]);
      if (res) {
        setDesksList(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setValue('deskId', null);
    watch('roomId') && getLists();
  }, [watch('roomId')]);

  return (
    <Modal
      width={700}
      style={{ top: 20 }}
      destroyOnClose
      title={t('add')}
      open={showAddBookingModal}
      onCancel={handleClose}
      cancelText={t('closeBtn')}
      okText={t('save')}
      className="generalModal"
      footer={[
        <AppHandledButton
          form="add-Booking-modal-form"
          type="primary"
          key="submit"
          htmlType="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Book
        </AppHandledButton>
      ]}
    >
      <Form
        id="add-Booking-modal-form"
        layout="vertical"
        className="addPordductTabOneContainer"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16}>
          <Col span={24}>
            <div className="pb-3">
              <AppHandledSelect
                label={'Room name'}
                name="roomId"
                required
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Owner')
                  }
                }}
                control={control}
                placeholder={inputPlaceholderText('Room name')}
                errors={errors}
                selectProps={{
                  showSearch: true,
                  id: 'roomId',
                  placeholder: selectPlaceholderText('Room name'),
                  className: 'w-full',
                  options:
                    roomsList?.map(z => ({
                      value: z?.id,
                      label: z?.name
                    })) || []
                }}
              />
            </div>
            <div className="pb-3">
              <AppHandledSelect
                label={'Desk name'}
                name="deskId"
                required
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Owner')
                  }
                }}
                control={control}
                placeholder={inputPlaceholderText('Desk name')}
                errors={errors}
                selectProps={{
                  disabled: !desksList?.length,
                  showSearch: true,
                  id: 'deskId',
                  placeholder: selectPlaceholderText('Desk name'),
                  className: 'w-full',
                  options:
                    desksList?.map(z => ({
                      value: z?.id,
                      label: z?.name
                    })) || []
                }}
              />
            </div>
            <div className="pb-3">
              <AppHandledSelect
                label={'User'}
                name="userId"
                required
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Owner')
                  }
                }}
                control={control}
                placeholder={inputPlaceholderText('User')}
                errors={errors}
                selectProps={{
                  allowClear: true,
                  showSearch: true,
                  id: 'userId',
                  placeholder: selectPlaceholderText('User'),
                  className: 'w-full',
                  options:
                    ownersList?.map(z => ({
                      value: z?.id,
                      label: z?.name
                    })) || []
                }}
              />
            </div>{' '}
            <div className="pb-3">
              <AppHandledDate
                label={'Start date'}
                name="startDate"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Owner')
                  }
                }}
                required
                placeholder={'Start date'}
                errors={errors}
                formItemProps={{
                  labelAlign: 'left',
                  labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                  style: { fontWeight: 'bolder' }
                }}
                dateProps={{
                  allowClear: true,
                  showTime: {
                    format: 'HH:mm'
                  },
                  style: {
                    width: '100%'
                  },
                  disabledDate: d => !d || d.isBefore(dayjs().startOf('day')),

                  format: 'DD.MM.YYYY HH:mm'
                }}
              />
            </div>
            <div className="pb-3">
              <AppHandledDate
                label={'End date'}
                name="endDate"
                required
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: inputValidationText('Owner')
                  }
                }}
                placeholder={'End date'}
                errors={errors}
                formItemProps={{
                  labelAlign: 'left',
                  labelCol: { span: 8, sm: 12, md: 10, lg: 8 },
                  style: { fontWeight: 'bolder' }
                }}
                dateProps={{
                  allowClear: true,
                  showTime: {
                    format: 'HH:mm'
                  },
                  style: {
                    width: '100%'
                  },
                  disabledDate: d => !d || d.isBefore(dayjs().startOf('day')),
                  format: 'DD.MM.YYYY HH:mm'
                }}
              />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddBookingModal;

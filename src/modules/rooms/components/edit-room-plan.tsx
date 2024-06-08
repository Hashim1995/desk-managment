// Ant Design components
import { Breadcrumb, Card, Col, Row, Space } from 'antd';

import { t } from 'i18next';
// Ant Design icons
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

// React and related libraries

// Constants
import AppHandledButton from '@/components/display/button/handle-button';

import { tokenizeImage } from '@/utils/functions/functions';
import GridCanvas from './generator/GridCanvas';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IDesk, IRoomByIdResponse } from '../types';

function EditRoomPlan() {
  const [currentRoom, setCurrentRoom] = useState<IRoomByIdResponse>();
  const [deskList, setDeskList] = useState<IDesk[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photoUrl, setPhotoUrl] = useState();
  const params = useParams();

  const [ownersCombo, setOwnersCombo] =
    useState<{ name: string; id: number }[]>();

  const fetchTokenizedImage = async (id: string) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${id}`
      });

      console.log(tokenizedFile, 'test99');
      setPhotoUrl(tokenizedFile);
    } catch (err) {
      console.log(err);
    }
  };

  async function getOwnerCombo() {
    try {
      const res = await RoomsService.getInstance().getOwnerComboList();
      if (res) {
        setOwnersCombo(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function getRoom() {
    try {
      const res = await RoomsService.getInstance().getRoomById(
        params?.id || ''
      );
      console.log(res, 'akif');
      if (res?.roomId) {
        setCurrentRoom(res);
        setDeskList(res?.desks);
        res?.photoFileId && fetchTokenizedImage(res?.photoFileId?.toString());
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getOwnerCombo();
    getRoom();
  }, []);

  async function save() {
    setIsSubmitting(true);
    const payload = {
      roomId: currentRoom?.roomId || 0,
      desks: deskList
    };
    try {
      await RoomsService.getInstance().saveDesk(payload);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    setIsSubmitting(false);
  }
  return (
    <div>
      <Card size="small" className="mb-4 box">
        <Row justify="space-between" gutter={[24, 24]} align="middle">
          <Col>
            <Space>
              <Breadcrumb
                items={[
                  {
                    title: (
                      <Link to="/home">
                        <HomeOutlined rev={undefined} />
                      </Link>
                    )
                  },

                  {
                    title: <Link to="/rooms">{t('rooms')}</Link>
                  },
                  {
                    title: t('create')
                  }
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <AppHandledButton
                onClick={() => {
                  save();
                }}
                form="create-contract-form"
                htmlType="submit"
                type="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                <Space>{t('save')}</Space>
              </AppHandledButton>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card size="small" className="mb-4 box">
        <GridCanvas
          ownersCombo={ownersCombo!}
          currentRoom={currentRoom!}
          photoUrl={photoUrl!}
          setDeskList={setDeskList}
          deskList={deskList}
        />
      </Card>
    </div>
  );
}

export default EditRoomPlan;

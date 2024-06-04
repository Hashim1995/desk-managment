import { useState } from 'react';
import { Col, Form, Row, Space, theme } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled_input';
import {
  inputValidationText,
  inputPlaceholderText
} from '@/utils/functions/functions';
import { ILogin, ILoginResponse } from '@/models/user';
import { AuthService } from '@/services/auth-services/auth_services';
import { useNavigate } from 'react-router-dom';
import Bg from '@assets/images/bg-2.png';
import AppHandledButton from '@/components/display/button/handle-button';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ILogin>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const { t } = useTranslation();

  const { useToken } = theme;
  const { token } = useToken();
  const darkMode = useReadLocalStorage('darkTheme');
  const navigate = useNavigate();

  const [isFormSubmiting, setIsFormSubmiting] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUserToken] = useLocalStorage<any>('userToken', null);
  const onSubmit: SubmitHandler<ILogin> = async (data: ILogin) => {
    setIsFormSubmiting(true);

    try {
      const payload = {
        email: data.email,
        password: data.password
      };

      const res: ILoginResponse = await AuthService.getInstance().login(
        payload,
        () => setIsFormSubmiting(false)
      );

      if (res.token) {
        setUserToken({ token: res?.token });
        navigate('/home');
      }
      setIsFormSubmiting(false);
    } catch (err) {
      toast.error(`${t('errorOccurred')}`);
      setIsFormSubmiting(false);
    }
  };

  return (
    <Row style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
      <Col span={12}>
        <Row className="h-screen" align={'middle'} justify={'center'}>
          <Col span={12}>
            <Row className="w-full" align="middle" justify="center">
              <Col span={24}>
                <h1 className="pb-3 text-2xl">Welcome to Admin Dashboard</h1>

                <Form
                  layout="vertical"
                  onFinish={handleSubmit(onSubmit)}
                  id="login-form"
                >
                  <Space className="w-full" direction="vertical">
                    <AppHandledInput
                      label={t('email')}
                      name="email"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('email'))
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('email'))}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={t('password')}
                      name="password"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('password'))
                        }
                      }}
                      required
                      control={control}
                      inputType="password"
                      placeholder={inputPlaceholderText(t('password'))}
                      errors={errors}
                    />

                    <AppHandledButton
                      block
                      loading={isFormSubmiting}
                      type="primary"
                      htmlType="submit"
                    >
                      {t('login')}
                    </AppHandledButton>
                  </Space>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={12}>
        <Row
          className="w-full h-full"
          justify="center"
          align="middle"
          style={{ backgroundColor: token.colorPrimary }}
        >
          <Col span={18}>
            <img width={500} height={500} alt="" src={Bg} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;

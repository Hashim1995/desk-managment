import { useState } from 'react';
import { Col, Form, Row, Space, theme } from 'antd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import AppHandledInput from '@/components/forms/input/handled_input';
import {
  inputValidationText,
  minLengthCheck,
  inputPlaceholderText
} from '@/utils/functions/functions';
import { IRegister, ILoginResponse } from '@/models/user';
import { AuthService } from '@/services/auth-services/auth_services';
import { ReactComponent as Illustration } from '@/assets/images/illustration.svg';
import { useNavigate } from 'react-router-dom';
import AppHandledInputMask from '@/components/forms/input-mask/handled-input-mask';
import AppHandledRadio from '@/components/forms/radio/handled-radio';
import AppHandledButton from '@/components/display/button/handle-button';
import { useTranslation } from 'react-i18next';

function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegister>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      fatherName: '',
      email: '',
      password: '',
      address: '',
      phone: '',
      mobilePhone: '',
      cardNumber: '',
      pin: '',
      tableNumber: '',
      birthdate: '',
      dateOfEmployment: '',
      dateOfDismissal: '',
      isTransactionsCounterpartyCard: false,
      division: '',
      initialAdjustmentTM: '',
      respondent: '',
      note: '',
      gender: 2,
      userType: 0,
      createdDate: '',
      fileId: 0
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
  const onSubmit: SubmitHandler<IRegister> = async (data: IRegister) => {
    setIsFormSubmiting(true);

    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
      fatherName: data.fatherName,
      phone: data.phone,
      gender: data.gender
    };

    const res: ILoginResponse = await AuthService.getInstance().login(
      payload,
      () => setIsFormSubmiting(false)
    );

    if (res) {
      setUserToken({ token: res.token });
      navigate('/home');
    }
    setIsFormSubmiting(false);
  };

  const options = [
    { label: t('man'), value: 1 },
    { label: t('woman'), value: 2 },
    { label: t('other'), value: 3 }
  ];

  return (
    <Row style={{ backgroundColor: darkMode ? '#000' : '#fff' }}>
      <Col span={12}>
        <Row className="h-screen" align={'middle'} justify={'center'}>
          <Col span={12}>
            <Row className="w-full" align="middle">
              <Col span={24}>
                <Form
                  layout="vertical"
                  onFinish={handleSubmit(onSubmit)}
                  id="register-form"
                >
                  <Space className="w-full" direction="vertical">
                    <AppHandledInput
                      label={t('name')}
                      name="Name"
                      inputProps={{
                        id: 'name'
                      }}
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('name'))
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(t('name'), '3')
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('name'))}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={t('surname')}
                      name="Surname"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('surname'))
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(t('surname'), '3')
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('surname'))}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={t('FathersName')}
                      name="FathersName"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('FathersName'))
                        },
                        minLength: {
                          value: 3,
                          message: minLengthCheck(t('FathersName'), '3')
                        }
                      }}
                      required
                      control={control}
                      inputType="text"
                      placeholder={inputPlaceholderText(t('FathersName'))}
                      errors={errors}
                    />
                    <AppHandledInput
                      label={t('email')}
                      name="email"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('email'))
                        },
                        validate: {
                          checkOnlyEnglishChars: (value: string) =>
                            /^[\w\\.-]+@[\w\\.-]+\.\w+$/.test(value) ||
                            `${t('enterValidEmailAddressErrorMessage')}`
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

                    <AppHandledRadio
                      label={t('gender')}
                      name="gender"
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('gender'))
                        }
                      }}
                      required
                      control={control}
                      errors={errors}
                      isGroup
                      options={options}
                    />
                    <AppHandledInputMask
                      label={t('contactNumber')}
                      name="phone"
                      control={control}
                      mask="\+\9\9\4 99-999-99-99"
                      maskChar={null}
                      rules={{
                        required: {
                          value: true,
                          message: inputValidationText(t('contactNumber'))
                        },
                        pattern: {
                          value: /^\+994\d{9}$/,
                          message: `${t('enterValidPhoneNumberErrorMessage')}`
                        }
                      }}
                      required
                      placeholder={inputPlaceholderText(t('contactNumber'))}
                      errors={errors}
                    />

                    <AppHandledButton
                      block
                      loading={isFormSubmiting}
                      type="primary"
                      htmlType="submit"
                    >
                      {t('register')}
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
            <Illustration className="w-full" />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Register;

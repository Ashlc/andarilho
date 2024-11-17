import logo from '@assets/Andarilho.svg';
import Column from '@components/Column';
import { MultiSelect } from '@components/MultiSelect';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { post } from '@services/api';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';

type ErrorResponse = {
  response?: {
    status: number;
  };
};

const Index = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const signIn = useSignIn();

  const disabilities = [
    { value: 'hearing', label: 'Auditiva' },
    { value: 'physical', label: 'Física' },
    { value: 'sight', label: 'Visual' },
    { value: 'speech', label: 'Fala' },
    { value: 'other', label: 'Outra' },
  ];

  const onSubmit = async (data: Record<string, unknown>) => {
    if (data['password'] !== data['password-confirmation']) {
      toast.error('As senhas não coincidem');
      return;
    }
    toast.message('Realizando cadastro...');
    try {
      const res = await post({
        path: '/user',
        data: {
          name: data['name'],
          cpf: data['cpf'],
          email: data['email'],
          password: data['password'],
          disabilities: data['disabilities'],
          role: 'user',
        },
      });
      console.log(res);
      console.clear();
      signIn({
        auth: {
          token: res.data.token,
          type: 'Bearer',
        },
        userState: res.data,
      });
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (e: unknown) {
      const error = e as ErrorResponse;
      if (error.response?.status === 400) {
        toast.error('Usuário já cadastrado');
      } else {
        toast.error('Erro ao realizar cadastro');
      }
    }
  };

  return (
    <Column className="w-full h-screen flex flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-10/12 mx-auto py-8"
      >
        <Column className="gap-4 mb-2">
          <img src={logo} className="w-20" alt="Logo Andarilho" />
          <h1 className="text-2xl font-bold">Cadastro</h1>
          <p className="text-sm">
            Já possui uma conta?{' '}
            <Link to="/login" className="font-bold underline">
              Entrar
            </Link>
          </p>
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" type="text" placeholder="" {...register('name')} />
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="cpf">CPF</Label>
          <InputMask mask="999.999.999-99" {...register('cpf')}>
            {(inputProps: any) => (
              <Input id="cpf" type="text" placeholder="" {...inputProps} />
            )}
          </InputMask>
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register('password', {
              required: 'Senha é obrigatória',
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  'A senha deve conter no mínimo 8 caracteres, 1 letra maiúscula e 1 número',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="password-confirmation">Confirme sua senha</Label>
          <Input
            id="password-confirmation"
            type="password"
            {...register('password-confirmation', {
              required: 'Confirmação de senha é obrigatória',
            })}
          />
          {errors['password-confirmation'] && (
            <p className="text-red-500">
              {errors['password-confirmation'].message}
            </p>
          )}
        </Column>
        <Column className="gap-2 w-full">
          <Label htmlFor="disabilities">
            Deficiências ou necessidades especiais
          </Label>
          <Controller
            name="disabilities"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                placeholder="Selecione as deficiências"
                options={disabilities}
                onValueChange={field.onChange}
              />
            )}
          />
          <Button className="w-full mt-4">ENVIAR</Button>
        </Column>
      </form>
    </Column>
  );
};

export default Index;

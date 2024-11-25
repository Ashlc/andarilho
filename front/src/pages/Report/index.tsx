import Files from '@components/Files';
import Row from '@components/Row';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Textarea } from '@components/ui/textarea';
import { IAuthUser } from '@interfaces/IAuthUser';
import { post } from '@services/api';
import { reverseGeocode } from '@services/nominatim';
import { center } from '@utils/center';
import { maptilerKey } from '@utils/environment';
import { getLocation } from '@utils/getLocation';
import { Map } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { Controller, useForm } from 'react-hook-form';
import {
  RiArrowDropLeftLine,
  RiErrorWarningLine,
  RiFocus3Line,
} from 'react-icons/ri';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

interface ILocation {
  address: string;
  complement: string;
  lat: number;
  long: number;
}

interface IReport {
  resource: string;
  description: string;
  photos: File[];
  locationId: number;
  userId: number;
}

const Index = () => {
  const adressReport = useLocation();
  const { lat, lng } = adressReport.state || {};

  const [location, setLocation] = useState<[number, number]>(center);
  const [address, setAddress] = useState<string>('');
  const authUser = useAuthUser<IAuthUser>();
  const token = authUser ? authUser.token : '';
  const [loading, setLoading] = useState<boolean>(false);
  const mapRef = useRef<Map>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, control } = useForm();

  const goHome = () => {
    navigate('/home');
  };

  const getLocationAddress = async () => {
    setLoading(true);

    try {
      const currentLocation = (await getLocation()) as [number, number];

      if (!currentLocation) {
        return;
      }

      mapRef.current?.flyTo(
        {
          lat: currentLocation[0],
          lng: currentLocation[1],
        },
        13,
      );

      setLocation(currentLocation);
      const address = await reverseGeocode(
        currentLocation[0],
        currentLocation[1],
      );
      setAddress(address);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast('Erro ao buscar endereço', { icon: <RiErrorWarningLine /> });
      setLoading(false);
    }
  };

  const createAdress = async (address: string, complement: string) => {
    const data = {
      address: address,
      complement: complement,
      latitude: location[0],
      longitude: location[1],
    };

    const res = await post({
      path: '/location',
      data,
      token,
    });

    return res.data.id;
  };

  const createReport = async (
    resource: string,
    description: string,
    images: File[],
    locationId: number,
  ) => {
    const data = {
      processNumber: '',
      resource: resource,
      description: description,
      photos: images,
      locationId: Number(locationId),
      userId: Number(authUser?.id),
      status: 'PENDING',
    };

    await post({
      path: '/report',
      data,
      token,
    });
    toast('Seu relatório foi enviado com sucesso.', {
      description: 'Obrigado por contribuir com a acessibilidade!',
    });
    goHome();
  };
  useEffect(() => {
    if (mapRef.current && location) {
      const map = mapRef.current;
      map.setView(location, 20);
    }
  }, [location]);

  useEffect(() => {
    if (lat && lng) {
      const newLocation: [number, number] = [lat, lng];
      console.log(newLocation);
      setLocation(newLocation);
      reverseGeocode(newLocation[0], newLocation[1]).then((address) =>
        setAddress(address),
      );
      mapRef.current?.flyTo(
        {
          lat: newLocation[0],
          lng: newLocation[1],
        },
        13,
      );
    }
  }, [lat, lng]);

  const onSubmit = async (data: unknown) => {
    const { complement } = data as ILocation;
    try {
      const adressId = await createAdress(address, complement);
      const { resource, description, photos } = data as IReport;
      await createReport(resource, description, photos, adressId);
    } catch (error) {
      console.error(error);
      toast('Erro ao criar reporte', { icon: <RiErrorWarningLine /> });
      return;
    }
    // goHome();
  };

  return (
    <div className="flex flex-col gap-5 min-h-full w-full">
      <Row className="w-full px-4 justify-between items-center font-semibold">
        <Button variant="ghost" size="icon" onClick={goHome}>
          <RiArrowDropLeftLine size={24} />
        </Button>
        <h2>REPORTAR ACESSIBILIDADE</h2>
      </Row>
      <div className="border-t border-b border-border h-[160px] bg-blue-400">
        <MapContainer
          ref={mapRef}
          center={location}
          zoom={30}
          scrollWheelZoom={true}
          //@ts-expect-error: Workaround for leaflet typings
          loadingControl={true}
        >
          <TileLayer
            url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${maptilerKey}`}
          />
          {location && (
            <CircleMarker
              center={location}
              pathOptions={{ color: 'black' }}
              radius={10}
            />
          )}
        </MapContainer>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full p-4 flex flex-col gap-8 pb-8"
      >
        <div className="grid items-center gap-2">
          <Label htmlFor="localização">Localização</Label>
          <Row className="gap-4 items-center h-fit">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="address"
                  {...field}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    field.onChange(e.target.value);
                  }}
                />
              )}
            />
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="rounded-full aspect-square"
              onClick={getLocationAddress}
            >
              <RiFocus3Line />
            </Button>
          </Row>
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="complemento">Complemento</Label>
          <Input
            id="complement"
            placeholder="Complemento"
            {...register('complement')}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="ocorrência">Ocorrência</Label>
          <div className="text-muted-foreground text-xs">
            Selecione o(s) recurso(s) não encontrado(s) ou com defeito(s)
          </div>
          <Controller
            name="resource"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o(s) recurso(s)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheelchair">Rampa de acesso</SelectItem>
                  {/* <SelectItem value="wheelchair">Elevador</SelectItem> */}
                  {/* <SelectItem value="blind">Corrimão</SelectItem> */}
                  <SelectItem value="tactile_paving">
                    Ausência de piso tátil
                  </SelectItem>
                  <SelectItem value="bathroom_adaptations">
                    Banheiros sem adaptações
                  </SelectItem>
                  <SelectItem value="braille_signs">
                    Ausência de placas com braile
                  </SelectItem>
                  <SelectItem value="braille_auditory_adaptations">
                    Falta de adaptações em braile ou auditivas
                  </SelectItem>
                  <SelectItem value="reserved_parking">
                    Ausência de vagas reservadas para PCDs
                  </SelectItem>
                  <SelectItem value="blind">Sinalização sonora</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="grid items-center gap-2">
          <Label htmlFor="observações">Observações</Label>
          <Textarea
            id="description"
            placeholder="Digite aqui"
            {...register('description')}
          />
        </div>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <div className="grid items-center gap-2">
              <Label htmlFor="fotos">Fotos(opcional)</Label>
              <Files setImages={field.onChange} />
            </div>
          )}
        />
        <Row className=" flex justify-center">
          <Button
            variant={'default'}
            className="w-full"
            type="submit"
            disabled={loading}
          >
            ENVIAR DENÚNCIA
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default Index;

import StatusTag from '@components/StatusTag';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import { Checkbox } from '@components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { IAuthUser } from '@interfaces/IAuthUser';
import { IReport } from '@interfaces/IReport';
import { get } from '@services/api';
import { resourceTranslation } from '@utils/resourceTranslation';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { Controller, useForm } from 'react-hook-form';
import { RiArrowRightLine, RiDashboardFill, RiFile3Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Label, Pie, PieChart } from 'recharts';
import { toast } from 'sonner';

const index = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([{ name: '', value: 0 }]);
  const { handleSubmit, control } = useForm();
  const [reports, setReports] = useState<IReport[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const { token } = useAuthUser() as IAuthUser;
  const chartConfig = {
    PENDING: {
      label: 'Pendente',
      color: '#ef4444',
    },
    EVALUATING: {
      label: 'Avaliando',
      color: '#eab308',
    },
    ONGOING: {
      label: 'Em andamento',
      color: '#a855f7',
    },
    FINISHED: {
      label: 'Finalizado',
      color: '#22c55e',
    },
  } satisfies ChartConfig;

  const getReports = async () => {
    const data = (await get({
      path: '/report',
      token: token,
    })) as unknown as IReport[];

    setReports(data);

    let totalReportsCount = 0;
    const categorizedData = data.reduce(
      (acc: Record<string, number>, item: IReport) => {
        const status = item.status;
        if (!acc[status]) {
          acc[status] = 0;
        }
        acc[status] += 1;
        totalReportsCount += 1;
        return acc;
      },
      {},
    );

    const chartDataArray = Object.keys(categorizedData).map((key) => ({
      name: key,
      value: categorizedData[key],
      fill: chartConfig[key as keyof typeof chartConfig].color,
    }));

    setTotalReports(totalReportsCount);
    setChartData(chartDataArray);
  };

  useEffect(() => {
    getReports();
  }, [token]);

  const onSubmit = (data: Record<string, boolean>) => {
    const checked: string[] = [];
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        checked.push(key);
      }
    });
    if (checked.length === 0) {
      toast.info('Nenhum reporte selecionado');
    }
  };

  return (
    <div className="w-full flex flex-row gap-8">
      <div className="flex flex-col gap-8">
        <Card className="h-[280px] aspect-square">
          <CardHeader className="pb-0 pt-4">
            <p className="font-semibold ">Estatísticas</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="h-[200px] aspect-square"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy ? viewBox.cy - 8 : 0}
                              className="text-3xl font-bold"
                            >
                              {totalReports.toLocaleString()}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16}>
                              Reportes
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pt-4">
            <p className="font-semibold">Últimos reportes</p>
          </CardHeader>
          <CardContent className="h-[240px]">
            <div className="flex flex-col gap-4">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="flex flex-row justify-between text-sm items-center"
                >
                  <p>{resourceTranslation[report.resource]}</p>
                  <p>
                    {report.createdAt &&
                      new Date(report.createdAt).toLocaleDateString('pt-br')}
                  </p>
                  <StatusTag size="dot" status={report.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grow flex flex-col gap-4">
        <div className="flex flex-row justify-between items-end">
          <div className="flex flex-row items-center gap-2 font-semibold">
            <RiDashboardFill size={20} />
            <h2>PAINEL DE CONTROLE</h2>
          </div>
          <Button form="report-form" type="submit" className="gap-2">
            <RiFile3Line />
            Gerar relatório
          </Button>
        </div>
        <form
          className="grow border rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
          id="report-form"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="w-10">
                    <Controller
                      name={report.id.toString()}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="h-4 w-4"
                          id={report.id.toString()}
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    {report.createdAt &&
                      new Date(report.createdAt).toLocaleDateString('pt-br')}
                  </TableCell>
                  <TableCell>{report.location.address}</TableCell>
                  <TableCell>{resourceTranslation[report.resource]}</TableCell>
                  <TableCell>
                    <StatusTag status={report.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="aspect-square"
                      onClick={() => {
                        navigate(`/reporte/${report.id}`);
                      }}
                    >
                      <RiArrowRightLine size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </form>
      </div>
    </div>
  );
};

export default index;

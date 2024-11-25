import Row from '@components/Row';
import Search from '@components/Search';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
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
import { get, post, put } from '@services/api';
import { resourceTranslation } from '@utils/resourceTranslation';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { Controller, useForm } from 'react-hook-form';
import {
  RiArrowRightLine,
  RiDashboardFill,
  RiFile3Line,
  RiFilterOffLine,
  RiLoader3Line,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Label, Pie, PieChart } from 'recharts';
import { toast } from 'sonner';

const index = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([{ name: '', value: 0 }]);
  const { handleSubmit, control } = useForm();
  const [reports, setReports] = useState<IReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [search, setSearch] = useState('');
  const [generatingReport, setGeneratingReport] = useState(false);
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
    if (token && reports.length === 0) {
      getReports();
    }
  }, [token]);

  const onSubmit = async (data: Record<string, boolean>) => {
    setGeneratingReport(true);
    try {
      const checked: string[] = Object.keys(data).filter((key) => data[key]);

      if (checked.length === 0) {
        toast.info('Nenhum reporte selecionado');
        return;
      }

      const response = await post({
        path: '/report/download-pdf',
        data: {
          reports: checked.map((id) => ({ processNumber: id })),
        },
        token: token,
        responseType: 'blob',
      });

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e: unknown) {
      console.error(e);
      toast.error(
        `Erro ao gerar relatório: ${
          e instanceof Error ? e.message : 'Erro desconhecido'
        }`,
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (value.length > 2) {
      const _filteredReports = reports.filter((report) =>
        report.processNumber.toString().includes(value),
      );
      setFilteredReports(_filteredReports);
    }
    if (value.length === 0) {
      setFilteredReports(reports);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setFilteredReports(reports);
  };

  const updateReportStatus = async (reportId: number, status: string) => {
    try {
      await put({
        path: `/report/${reportId}/status`,
        data: { status },
        token: token,
      });
    } catch (e: unknown) {
      console.error(e);
      toast.error(
        `Erro ao atualizar status do reporte: ${
          e instanceof Error ? e.message : 'Erro desconhecido'
        }`,
      );
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
              {filteredReports.slice(0, 5).map((report) => (
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
          <Button
            form="report-form"
            type="submit"
            className="gap-2 w-[150px]"
            disabled={generatingReport}
          >
            {generatingReport ? (
              <RiLoader3Line className="animate-spin" />
            ) : (
              <>
                <RiFile3Line />
                Gerar relatório
              </>
            )}
          </Button>
        </div>
        <Row className="gap-2">
          <Search
            value={search}
            onChange={onSearchChange}
            placeholder="Pesquisar por número de processo"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={clearSearch}
            className="border-black w-fit px-4 gap-2"
          >
            <RiFilterOffLine size={18} />
            Limpar filtros
          </Button>
        </Row>
        <form
          className="grow border rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
          id="report-form"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Nº Processo</TableHead>
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
                      name={report.processNumber.toString()}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          className="h-4 w-4"
                          id={report.processNumber.toString()}
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>{report.processNumber}</TableCell>
                  <TableCell>
                    {report.createdAt &&
                      new Date(report.createdAt).toLocaleDateString('pt-br')}
                  </TableCell>
                  <TableCell>{report.location.address}</TableCell>
                  <TableCell>{resourceTranslation[report.resource]}</TableCell>
                  <TableCell>
                    <Select
                      value={report.status}
                      onValueChange={(value) => {
                        updateReportStatus(report.id, value);
                      }}
                    >
                      <SelectTrigger className="border-black">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <Row className="items-center gap-2">
                            <StatusTag status="PENDING" size="dot" />
                            Pendente
                          </Row>
                        </SelectItem>
                        <SelectItem value="EVALUATING">
                          <Row className="items-center gap-2">
                            <StatusTag status="EVALUATING" size="dot" />
                            Em análise
                          </Row>
                        </SelectItem>
                        <SelectItem value="ONGOING">
                          <Row className="items-center gap-2">
                            <StatusTag status="ONGOING" size="dot" />
                            Em andamento
                          </Row>
                        </SelectItem>
                        <SelectItem value="FINISHED">
                          <Row className="items-center gap-2">
                            <StatusTag status="FINISHED" size="dot" />
                            Finalizado
                          </Row>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <StatusTag status={report.status} /> */}
                  </TableCell>
                  <TableCell className="flex flex-row">
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

import Column from '@components/Column';
import ReportType from '@components/ReportType';
import Row from '@components/Row';
import Search from '@components/Search';
import StatusTag from '@components/StatusTag';
import { Button } from '@components/ui/button';
import { IAuthUser } from '@interfaces/IAuthUser';
import { IReport } from '@interfaces/IReport';
import { get } from '@services/api';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import {
  RiArrowDropLeftLine,
  RiArrowDropRightFill,
  RiFilter2Fill,
} from 'react-icons/ri';
import { CiClock2, CiLocationOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<IReport[]>([]);
  const authUser = useAuthUser<IAuthUser>();
  const token = authUser?.token;
  const goHome = () => {
    navigate('/home');
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };

    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', options);
  };

  const getReports = async () => {
    const response = await get({
      path: '/report',
      token,
    });

    const filteredReports = response.filter(
      (report: IReport) => report.userId === authUser?.id,
    );
    setReports(filteredReports as unknown as IReport[]);
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <>
      <Column>
        <div className="flex flex-row w-full px-4 justify-between items-center font-semibold border-b pb-5">
          <Button variant="ghost" size="icon" onClick={goHome}>
            <RiArrowDropLeftLine size={24} />
          </Button>
          <h2>MEUS REPORTES</h2>
        </div>
        <div className="flex flex-row justify-between px-3 gap-5 border-b py-5">
          <Search />
          <Button variant="outline" className="border border-border">
            <RiFilter2Fill size={18} />
            Filtros
          </Button>
        </div>
        {reports.length === 0 && (
          <p className="p-5">Nenhum reporte encontrado</p>
        )}
        <Column>
          {reports.map((report) => (
            <div key={report.id} className="border-b border-border">
              <div className="flex flex-row py-3 px-3 items-center space-x-3">
                <ReportType type={report.resource} />
                <Column className="w-full space-y-1">
                  <Row className="gap-2 items-center">
                    <p className="font-semibold text-sm">
                      {report.description}
                    </p>
                    <StatusTag status={report.status} />
                  </Row>
                  {report.createdAt && (
                    <Column className="text-xs gap-1">
                      <Row className="text-muted-foreground text-xs gap-1">
                        <CiClock2 size={16} />
                        <p>{formatDate(report.createdAt)}</p>
                      </Row>
                      <Row className="text-muted-foreground text-xs gap-1">
                        <CiLocationOn size={16} />
                        <p>{report.location.address}</p>
                      </Row>
                    </Column>
                  )}
                </Column>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  className="aspect-square"
                  onClick={() => navigate(`/reporte/${report.id}`)}
                >
                  <RiArrowDropRightFill size={20} />
                </Button>
              </div>
            </div>
          ))}
        </Column>
        <div className="w-full p-4 bg-background sticky bottom-0">
          <Button
            onClick={() => navigate('/reporte')}
            className="w-full"
            variant="default"
          >
            Novo reporte
          </Button>
        </div>
      </Column>
    </>
  );
}

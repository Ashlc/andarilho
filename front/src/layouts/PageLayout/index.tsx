import Header from '@components/Header';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Index = ({ children }: Props) => (
  <div className="min-h-screen w-screen">
    <Header />
    <div className="sm:w-screen md:w-10/12 pt-6 pb-4 mx-auto">{children}</div>
  </div>
);

export default Index;

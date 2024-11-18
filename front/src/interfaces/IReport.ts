export interface Address {
  id: number;
  address: string;
  complement: string;
  latitude: number;
  longitude: number;
}

export interface IReport {
  id: number;
  processNumber?: string;
  location: Address;
  type: 'wheelchair' | 'blind';
  resource: 'RAMP' | 'blind';
  photos: string[];
  status: 'PENDING' | 'EVALUATING' | 'ONGOING' | 'FINISHED';
  createdAt?: string;
  description?: string;
  userId: number;
}

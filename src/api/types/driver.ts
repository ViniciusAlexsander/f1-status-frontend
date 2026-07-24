export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface DriverData {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  teams: TeamData[];
}

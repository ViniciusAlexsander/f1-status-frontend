export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface DriverStandingsData {
  id: string;
  position: number;
  points: number;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  teams: TeamData[];
}

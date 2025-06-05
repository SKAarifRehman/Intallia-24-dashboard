
export interface Roles {
  UserGroupId: string;
  CompanyId: string;
  Description: string;
}


export interface User {
  UserId: string;
  Email: string;
  UserGroupId: string;
  CompanyId: string;
}

export interface Payment {
  id: string;
  name: string;
  email: string;
  date: string;
  packageCategory: string;
  amount: number;
}

export interface Transaction {
  userName: string;
  packageName: string;
  email: string;
  phoneNo: string;
  amount: string;
  coupon: string;
  date: string;
  status: string;
}

export interface Invitation {
  id: string;
  packageName: string;
  validity: string;
  price: string;
  activeUsers: string;
  status: string;
  invoice: string;
}

export interface Company {
  CompanyId: string;
  CompanyName: string;
  ContactPersonName: string;
  Website: string;
  PhoneNumber: string;
  Email: string;
  Address: string;
  City: string;
  State: string;
  Country: string;
  Status: string;
  CreateBy: string;
  CreateDate: Date;
  ModifyBy: string;
  ModifyDate: Date;
}

export interface Plan {
  PlanID: string;
  UserID: string;
  PackageName: string;
  Plan1: string;
  Plan2: string;
  Plan3: string;
}

export interface UserEduction {
  Education: string;
  UserId: string;
  Degree: string;
  Description: string;
  StartDate: Date;
  EndDate: Date;
  CreateBy: string;
  CreateDate: Date;
  ModifyBy: null;
  ModifyDate:Date;
}

export interface Simulation {
  SimulationId: string;
  CompanyId: string;
  Name: string;
  Description: string;
  CardDescription: string;
  BannerImage: string;
  CTAImage: string;
  CardImage: string;
  DefficultyLevel: string;
  Plane: string;
  PriorityLevel: string;
  Tags: string;
  CreateBy?: string;
  ModifyBy?: string;
  ModifyDate?: Date;
  CreateDate?: Date;
  Guided: boolean;
}

export interface Task {
  id: string;
  description: string;
  sheetName?: string;
  cellLocation?: string;
  selectType?: "Cell" | "Range";
  fromRange?: string;
  toRange?: string;
  skillName?: string;
  skillScore?: string;
}

export type SoftwareType =
  | "MS Excel"
  | "MS Word"
  | "Google Sheets"
  | "Google Docs"
  | "MS Powerpoint"
  | "Google Slides";

export interface SoftwareSection {
  id: string;
  software: SoftwareType;
  tasks: Task[];
}

export interface TaskCounts {
  [key: string]: number;
}

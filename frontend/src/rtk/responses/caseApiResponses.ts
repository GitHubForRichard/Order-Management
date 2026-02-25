import { Assignee, Case } from "types/cases";
import { User } from "types/customer";

export type GetCasesResponse = Case[];
export type GetAssigneesResponse = Assignee[];
export type GetShipStationTrackingResponse = {
  carrierCode: string;
  serviceCode: string;
  shipTo: {
    name: string;
  };
  shipDate: string;
  trackingNumber: string;
}[];

export type GetCaseHistoryResponse = {
  action: string;
  created_by: User;
  created_at: string;
  field: string;
  id: string;
  new_value: string;
  old_value: string;
}[];

export type CaseAttachment = {
  case_id: string;
  created_at: string;
  deleted_at: string | null;
  drive_file_id: string;
  id: string;
  name: string;
  url: string;
};

export type GetCaseAttachmentsResponse = {
  files: CaseAttachment[];
};

export type CreateCaseResponse = {
  case: Case;
};

export type OrderHistoryItem = {
  product_number: string;
  product_quantity: number;
  date: string;
  s_o_num: string;
  p_o_num: string;
  ship_to_name: string;
};

export type GetOrderHistoryResponse = {
  orders: OrderHistoryItem[];
};

export type ProductDetailItem = {
  part: string;
  description: string;
  on_hand: number;
  allocated: number;
  available: number;
  available_to_pick: number;
  on_order: number;
  committed: number;
};

export type GetProductsResponse = {
  products: ProductDetailItem[];
};

export type GetModelNumbersResponse = {
  model_numbers: string[];
};

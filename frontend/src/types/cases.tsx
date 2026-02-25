export type Case = {
  id: string;
  customer_id: string;
  model_number: string;
  issues: string;
  case_number: string;
  sales_order: string;
  purchase_order: string;
  market_place: string;
  assign: string;
  status: string;
  serial: string;
  solution: string;
  action: string;
  tracking: string;
  return_status: string;
  return_for_service: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Assignee = {
  name: string;
  email: string;
};

export type CreateLeaveRequest = {
  start_date: string;
  end_date: string;
  hours: number;
  type: "Paid" | "Unpaid";
};

export type GetUserRemainingHoursResponse = {
  user_id: string;
  remaining_hours: number;
  advanced_remaining_hours: number;
};

export type GetAllUsersRemainingHoursResponse = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  remaining_hours: number;
  advanced_remaining_hours: number;
}[];

export type GetUserHoursHistoryResponse = {
  id: string;
  field: string;
  old_value: string;
  new_value: string;
  created_at: string;
}[];

export type LeaveSummary = {
  id: string;
  name: string;
  totalHours: number;
};

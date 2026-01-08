import { baseApi } from "../rtkApi";
import { Leave } from "../pages/LeavePage/LeavePage";
import { notify } from "../redux/notificationsSlice";

type CreateLeaveRequest = {
  start_date: string;
  end_date: string;
  hours: number;
  type: "Paid" | "Unpaid";
};

type GetUserRemainingHoursResponse = {
  user_id: string;
  remaining_hours: number;
  advanced_remaining_hours: number;
};

export type LeaveSummary = {
  id: string;
  name: string;
  totalHours: number;
};

export type LeaveAction = "approve" | "reject" | "cancel";

export const leavesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query<Leave[], { role?: "manager" } | void>({
      query: (params) => ({
        url: "leaves",
        params: params ? params : undefined,
      }),
      providesTags: ["Leaves"],
    }),

    createLeaves: builder.mutation<void, CreateLeaveRequest>({
      query: (body) => ({
        url: "leaves",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leaves"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;

          dispatch({
            type: "notifications/notify",
            payload: {
              message: `Leave submitted successfully`,
              severity: "success",
            },
          });
        } catch {
          dispatch({
            type: "notifications/notify",
            payload: {
              message: "Failed to submit leave",
              severity: "error",
            },
          });
        }
      },
    }),

    getUserRemainingHours: builder.query<GetUserRemainingHoursResponse, void>({
      query: () => "leaves/remaining",
      providesTags: ["Leaves"],
    }),

    getLeaveSummary: builder.query<
      LeaveSummary[],
      { start_date?: string; end_date?: string } | void
    >({
      query: (params = {}) => ({
        url: "leaves/summary",
        params: params ? params : undefined,
      }),
      providesTags: ["Leaves"],
    }),

    processLeave: builder.mutation<
      void,
      { leaveId: number; action: LeaveAction }
    >({
      query: ({ leaveId, action }) => ({
        url: `leaves/${leaveId}/action`,
        method: "PATCH",
        body: { action },
      }),
      invalidatesTags: ["Leaves"], // refetch leave lists automatically
      async onQueryStarted({ action }, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          let actionText = "";

          if (action === "approve") {
            actionText = "Approved";
          } else if (action === "reject") {
            actionText = "Rejected";
          } else if (action === "cancel") {
            actionText = "Cancelled";
          }

          dispatch({
            type: "notifications/notify",
            payload: {
              message: `Leave ${actionText} successfully`,
              severity: "success",
            },
          });
        } catch {
          dispatch({
            type: "notifications/notify",
            payload: {
              message: "Failed to process leave",
              severity: "error",
            },
          });
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeavesQuery,
  useCreateLeavesMutation,
  useGetUserRemainingHoursQuery,
  useGetLeaveSummaryQuery,
  useProcessLeaveMutation,
} = leavesApi;

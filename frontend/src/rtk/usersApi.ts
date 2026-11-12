import { baseApi } from "rtkApi";
import { User } from "types/customer";
import { notify } from "../redux/notificationsSlice";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getUser: builder.query<User, { id: string }>({
      query: ({ id }) => `users/${id}`,
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation<
      User,
      {
        id: string;
        join_date?: string;
        role?: string;
        work_location?: string;
        status?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            notify({
              message: "User updated successfully!",
              severity: "success",
            })
          );
        } catch (err) {
          dispatch(
            notify({
              message: "Failed to update user",
              severity: "error",
            })
          );
        }
      },
    }),

    setUserPassword: builder.mutation<
      { message: string },
      { id: string; password: string }
    >({
      query: ({ id, password }) => ({
        url: `users/${id}/password`,
        method: "PUT",
        body: { password },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            notify({
              message: "Password updated",
              severity: "success",
            })
          );
        } catch ({ error }: any) {
          dispatch(
            notify({
              message: error?.data?.error || "Failed to update password",
              severity: "error",
            })
          );
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useSetUserPasswordMutation,
} = usersApi;

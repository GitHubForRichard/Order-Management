import { baseApi } from "../rtkApi";
import { User } from "@/types/customer";
import { notify } from "../redux/notificationsSlice";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      User,
      { id: string; join_date?: string; role?: string; work_location?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
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
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useUpdateUserMutation } = usersApi;

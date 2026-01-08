import { baseApi } from "rtkApi";
import { Customer, User } from "types/customer";
import { notify } from "../redux/notificationsSlice";

import { Assignee, Case } from "types/cases";

type UploadCaseAttachmentsRequest = {
  caseId: string;
  files: File[];
};

type UpdateCaseAttachmentsRequest = {
  caseId: string;
  filesToAdd?: File[];
  filesToRemove?: string[];
};

type GetCasesResponse = Case[];
type GetAssigneesResponse = Assignee[];
type GetShipStationTrackingResponse = {
  carrierCode: string;
  serviceCode: string;
  shipTo: {
    name: string;
  };
  shipDate: string;
  trackingNumber: string;
}[];

type GetCaseHistoryResponse = {
  action: string;
  created_by: User;
  created_at: string;
  field: string;
  id: string;
  new_value: string;
  old_value: string;
}[];

type CaseAttachment = {
  case_id: string;
  created_at: string;
  deleted_at: string | null;
  drive_file_id: string;
  id: string;
  name: string;
  url: string;
};

type GetCaseAttachmentsResponse = {
  files: CaseAttachment[];
};

type CreateCaseResponse = {
  case: Case;
};

type OrderHistoryItem = {
  product_number: string;
  product_quantity: number;
  date: string;
  s_o_num: string;
  p_o_num: string;
  ship_to_name: string;
};

type GetOrderHistoryResponse = {
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

type GetProductsResponse = {
  products: ProductDetailItem[];
};

type ModelNumbersResponse = {
  model_numbers: string[];
};

export const casesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCases: builder.query<GetCasesResponse, void>({
      query: () => "cases",
      providesTags: ["Cases"],
    }),

    createCase: builder.mutation<CreateCaseResponse, Case>({
      query: (body) => ({
        url: "cases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cases"],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            notify({
              message: "Case created successfully!",
              severity: "success",
            })
          );
        } catch (error) {
          dispatch(
            notify({
              message: "Failed to create case!",
              severity: "error",
            })
          );
        }
      },
    }),

    updateCase: builder.mutation<Case, { caseId: string; body: Partial<Case> }>(
      {
        query: ({ caseId, body }) => ({
          url: `cases/${caseId}`,
          method: "PUT",
          body,
        }),

        invalidatesTags: ["Cases"],
        async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
          try {
            await queryFulfilled;
            dispatch(
              notify({
                message: "Case updated successfully!",
                severity: "success",
              })
            );
          } catch (error) {
            dispatch(
              notify({
                message: "Failed to update case!",
                severity: "error",
              })
            );
          }
        },
      }
    ),

    getAssignees: builder.query<GetAssigneesResponse, void>({
      query: () => "assignees",
    }),

    getCustomers: builder.query<Customer[], void>({
      query: () => "customers",
      providesTags: ["Customers"],
    }),

    createCustomer: builder.mutation<{ customer: Customer }, Partial<Customer>>(
      {
        query: (body) => ({
          url: "customers",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Customers"],
        async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
          try {
            await queryFulfilled;
            dispatch(
              notify({
                message: "Customer created successfully!",
                severity: "success",
              })
            );
          } catch {
            dispatch(
              notify({
                message: "Failed to create customer!",
                severity: "error",
              })
            );
          }
        },
      }
    ),

    updateCustomer: builder.mutation<
      Customer,
      { id: string; body: Partial<Customer> }
    >({
      query: ({ id, body }) => ({
        url: `customers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customers"],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(
            notify({
              message: "Customer updated successfully!",
              severity: "success",
            })
          );
        } catch {
          dispatch(
            notify({
              message: "Failed to update customer!",
              severity: "error",
            })
          );
        }
      },
    }),

    getShipStationTracking: builder.query<
      GetShipStationTrackingResponse,
      { trackingNumber: string }
    >({
      query: ({ trackingNumber }) => `shipstation/${trackingNumber}`,
    }),

    getCaseHistory: builder.query<GetCaseHistoryResponse, { caseId: string }>({
      query: ({ caseId }) => `cases/history/${caseId}`,
      providesTags: ["Cases"],
    }),

    getCaseAttachments: builder.query<CaseAttachment[], { caseId: string }>({
      query: ({ caseId }) => `files/${caseId}`,
      providesTags: ["Attachments"],
      transformResponse: (response: GetCaseAttachmentsResponse) => {
        return response.files;
      },
    }),

    uploadCaseAttachments: builder.mutation<void, UploadCaseAttachmentsRequest>(
      {
        query: ({ caseId, files }) => {
          const formData = new FormData();
          files.forEach((file) => formData.append("files", file));

          return {
            url: `files/${caseId}`,
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["Attachments"],
        async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
          try {
            await queryFulfilled;
            dispatch(
              notify({
                message: "Attachments uploaded successfully!",
                severity: "success",
              })
            );
          } catch {
            dispatch(
              notify({
                message: "Failed to upload attachments!",
                severity: "error",
              })
            );
          }
        },
      }
    ),

    updateCaseAttachments: builder.mutation<void, UpdateCaseAttachmentsRequest>(
      {
        query: ({ caseId, filesToAdd = [], filesToRemove = [] }) => {
          const formData = new FormData();
          filesToRemove.forEach((id: string) =>
            formData.append("remove[]", id)
          );
          filesToAdd.forEach((file: File) => formData.append("add", file));

          return {
            url: `files/${caseId}`,
            method: "PUT",
            body: formData,
          };
        },
        invalidatesTags: ["Attachments"],
        async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
          try {
            await queryFulfilled;
            dispatch(
              notify({
                message: "Attachments updated successfully!",
                severity: "success",
              })
            );
          } catch {
            dispatch(
              notify({
                message: "Failed to update attachments!",
                severity: "error",
              })
            );
          }
        },
      }
    ),

    getOrderHistory: builder.query<
      GetOrderHistoryResponse,
      { searchTerm: string }
    >({
      query: ({ searchTerm }) => `order-history?search_term=${searchTerm}`,
    }),

    getProducts: builder.query<GetProductsResponse, void>({
      query: () => "products",
    }),

    getModelNumbers: builder.query<ModelNumbersResponse, void>({
      query: () => "model-numbers",
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCasesQuery,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useGetAssigneesQuery,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useGetShipStationTrackingQuery,
  useGetCaseHistoryQuery,
  useGetCaseAttachmentsQuery,
  useUploadCaseAttachmentsMutation,
  useUpdateCaseAttachmentsMutation,
  useGetOrderHistoryQuery,
  useGetProductsQuery,
  useGetModelNumbersQuery,
} = casesApi;

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@mui/material";

import api from "../../api";

import CustomerList from "../CustomerList";
import OrderHistory from "../OrderHistory";
import ProductDetail from "../ProductDetail";
import CustomerInfo from "./components/CustomerInfo";
import AddressInfo from "./components/AddressInfo";
import OrderInfo from "./components/OrderInfo";
import ExtraInfo from "./components/ExtraInfo";
import CaseDetail from "./components/CaseDetail";

import { CASE_FORM_ACTION_TYPES } from "../../constants";

import { Customer } from "@/types/customer";
import Attachments from "./Attachments";

export const defaultValues = {
  first_name: "",
  last_name: "",
  mid: "",
  email: "",
  phone_code: "",
  phone_number: "",
  model_number: "",
  issues: "",
  case_number: "",
  sales_order: "",
  street: "",
  city: "",
  zip_code: "",
  state: "",
  country: "",
  assign: "",
  status: "",
  serial: "",
  solution: "",
  action: "",
  file_name: "",
  tracking: "",
  return_status: "",
  attachments: [],
};

const NewCaseForm = () => {
  const methods = useForm({
    defaultValues,
  });

  const [cases, setCases] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  // useEffect to get customers
  React.useEffect(() => {
    api
      .get("customers")
      .then((response) => {
        const fetchedCustomers = response.data;
        setCustomers(fetchedCustomers);
      })
      .catch((error) =>
        console.error("There was an error loading the customers!", error)
      );
  }, []);

  // useEffect for getting cases
  React.useEffect(() => {
    api
      .get("cases")
      .then((response) => {
        const fetchedCases = response.data;
        setCases(fetchedCases);
      })
      .catch((error) =>
        console.error("There was an error loading the cases!", error)
      );
  }, []);

  const uploadAttachmentsToCase = async (
    attachments: File[],
    caseId: string
  ) => {
    const formData = new FormData();
    attachments.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post(`files/${caseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const onFormCreate = async (data: any) => {
    try {
      let customerId = null;
      if (!selectedCustomer) {
        const postCustomerResponse = await api.post("customers", data);
        setCustomers((prev) => [...prev, postCustomerResponse.data.customer]);
        customerId = postCustomerResponse.data.customer.id;
      } else {
        customerId = selectedCustomer.id;
        const updateCustomerResponse = await api.put(
          `customers/${customerId}`,
          data
        );
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === customerId
              ? updateCustomerResponse.data.customer
              : customer
          )
        );
      }

      const casePostResponse = await api.post("cases", {
        ...data,
        customer_id: customerId,
      });

      const newCase = casePostResponse.data.case;
      if (data.attachments) {
        await uploadAttachmentsToCase(data.attachments, newCase.id);
      }

      const casesGetResponse = await api.get("cases");
      setCases(casesGetResponse.data);
      methods.reset(defaultValues);
    } catch (error) {
      console.error("There was an error creating the case!", error);
    }
  };

  const handleCustomerRowSelect = (row) => {
    setSelectedCustomer(row);
    methods.reset({
      first_name: row.first_name,
      last_name: row.last_name,
      mid: row.mid,
      phone_code: row.phone_code,
      phone_number: row.phone_number,
      email: row.email,
      street: row.street,
      city: row.city,
      zip_code: row.zip_code,
      state: row.state,
      country: row.country,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFormCreate)}>
        <div className="form-container">
          <div className="form-left">
            <div className="form-row">
              <div className="form-section-card half-width">
                <CustomerInfo
                  caseFormActionType={CASE_FORM_ACTION_TYPES.NEW}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
                <AddressInfo />
              </div>

              <div className="form-section-card half-width">
                <OrderInfo caseFormActionType={CASE_FORM_ACTION_TYPES.NEW} />
                <ExtraInfo />
              </div>
            </div>
            <div className="form-container">
              <div className="form-left search-case">
                <CustomerList
                  customers={customers}
                  onRowDoubleClicked={handleCustomerRowSelect}
                />
              </div>
              <div className="form-left ship-product">
                <OrderHistory
                  customerName={
                    selectedCustomer
                      ? selectedCustomer.first_name +
                        " " +
                        selectedCustomer.last_name
                      : ""
                  }
                />
                <ProductDetail />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-right sticky-right">
            <div className="form-section-card">
              <CaseDetail />

              <div className="action-buttons">
                <Button type="submit" variant="contained">
                  Create New
                </Button>
              </div>
            </div>
            <Attachments
              caseFormActionType={CASE_FORM_ACTION_TYPES.NEW}
              selectedCase={null}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewCaseForm;

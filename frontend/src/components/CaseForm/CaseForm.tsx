import React from "react";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@mui/material";

import CustomerList from "../CustomerList";
import OrderHistory from "../OrderHistory";
import ProductDetail from "../ProductDetail";
import ShipStationTracks from "../ShipStationTracks";
import CustomerInfo from "./components/CustomerInfo";
import AddressInfo from "./components/AddressInfo";
import OrderInfo from "./components/OrderInfo";
import ExtraInfo from "./components/ExtraInfo";
import CaseDetail from "./components/CaseDetail";

import { CASE_FORM_ACTION_TYPES } from "../../constants";

import { Customer } from "@/types/customer";
import CaseList from "../CaseList";

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
  status: "Pending",
  serial: "",
  solution: "",
  action: "",
  file_name: "",
  tracking: "",
  return_status: "",
};

const CaseForm = ({ actionType }) => {
  const methods = useForm({
    defaultValues,
  });

  const [cases, setCases] = React.useState<any[]>([]);
  const [selectedCase, setSelectedCase] = React.useState<any | null>(null);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  // useEffect to get customers
  React.useEffect(() => {
    axios
      .get("http://localhost:5001/api/customers")
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
    axios
      .get("http://localhost:5001/api/cases")
      .then((response) => {
        const fetchedCases = response.data;
        setCases(fetchedCases);
      })
      .catch((error) =>
        console.error("There was an error loading the cases!", error)
      );
  }, []);

  const onFormCreate = async (data: any) => {
    try {
      let customerId = null;
      if (!selectedCustomer) {
        const postCustomerResponse = await axios.post(
          "http://localhost:5001/api/customers",
          data
        );
        setCustomers((prev) => [...prev, postCustomerResponse.data.customer]);
        customerId = postCustomerResponse.data.customer.id;
      } else {
        customerId = selectedCustomer.id;
        const updateCustomerResponse = await axios.put(
          `http://localhost:5001/api/customers/${customerId}`,
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

      await axios.post("http://localhost:5001/api/cases", {
        ...data,
        customer_id: customerId,
      });

      const casesGetResponse = await axios.get(
        "http://localhost:5001/api/cases"
      );
      setCases(casesGetResponse.data);
      methods.reset(defaultValues);
    } catch (error) {
      console.error("There was an error creating the case!", error);
    }
  };

  const onFormUpdate = async (data: any) => {
    try {
      await axios.put(
        `http://localhost:5001/api/cases/${selectedCase.id}`,
        data
      );
      const casesGetResponse = await axios.get(
        "http://localhost:5001/api/cases"
      );
      setCases(casesGetResponse.data);
      methods.reset(defaultValues);
    } catch (error) {
      console.error("There was an error updating the case!", error);
    }
  };

  const handleCaseRowSelect = (row) => {
    setSelectedCase(row);
    console.log("row", row);
    methods.reset({
      ...row,
      first_name: row.customer.first_name,
      last_name: row.customer.last_name,
      mid: row.customer.mid,
      phone_code: row.customer.phone_code,
      phone_number: row.customer.phone_number,
      email: row.customer.email,
      street: row.customer.street,
      city: row.customer.city,
      zip_code: row.customer.zip_code,
      state: row.customer.state,
      country: row.customer.country,
    });
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
      <form
        onSubmit={methods.handleSubmit(
          actionType === CASE_FORM_ACTION_TYPES.NEW
            ? onFormCreate
            : onFormUpdate
        )}
      >
        {actionType === CASE_FORM_ACTION_TYPES.EXIST && (
          <CaseList cases={cases} onRowDoubleClicked={handleCaseRowSelect} />
        )}
        <div className="form-container">
          <div className="form-left">
            <div className="form-row">
              <div className="form-section-card half-width">
                <CustomerInfo
                  caseFormActionType={actionType}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />
                <AddressInfo />
              </div>

              <div className="form-section-card half-width">
                <OrderInfo caseFormActionType={actionType} />
                <ExtraInfo />
              </div>
            </div>

            <div className="form-container">
              <div className="form-left search-case">
                {actionType === CASE_FORM_ACTION_TYPES.NEW && (
                  <>
                    <CustomerList
                      customers={customers}
                      onRowDoubleClicked={handleCustomerRowSelect}
                    />
                    <ShipStationTracks shipStationTracks={[]} />
                  </>
                )}
              </div>
              <div className="form-left ship-product">
                {actionType === CASE_FORM_ACTION_TYPES.NEW && (
                  <OrderHistory
                    cases={cases}
                    customer_id={selectedCustomer?.id}
                  />
                )}
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
                  {actionType === CASE_FORM_ACTION_TYPES.NEW
                    ? "Create New"
                    : "Update"}
                </Button>
              </div>
            </div>

            {actionType === CASE_FORM_ACTION_TYPES.NEW && (
              <div className="form-section-card">
                <h3 className="section-title">Attachments</h3>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CaseForm;

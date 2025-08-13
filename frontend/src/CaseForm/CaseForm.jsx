import React from "react";
import { useForm } from "react-hook-form";

import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";

import {
  CANADA_PROVINCES,
  COUNTRIES,
  PHONE_COUNTRY_CODES,
  MODEL_NUMBERS,
  US_STATES,
} from "../constants";

import CustomerList from "../CustomerList";
import OrderHistory from "../OrderHistory";
import ProductDetail from "../ProductDetail";
import ShipStationTracks from "../ShipStationTracks";
import CustomerInfo from "./CusotmerInfo";
import AddressInfo from "./AddressInfo";
import OrderInfo from "./OrderInfo";
import ExtraInfo from "./ExtraInfo";
import CaseDetail from "./CaseDetail";

const CaseForm = ({
  customers,
  orders,
  selectedCustomer,
  setSelectedCustomer,
  setNewOrder,
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const initialOrder = {};

  const country = watch("country");

  const onSubmit = (data) => {
    console.log("data", data);
  };

  const handleCustomerRowSelect = (row) => {
    setSelectedCustomer(row);
    setNewOrder((prev) => ({
      ...prev,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone_number: row.phone_number,
      street: row.street,
      city: row.city,
      state: row.state,
      zip_code: row.zip_code,
      country: row.country,
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container">
        {/* Left Column */}
        <div className="form-left">
          <div className="form-row">
            <div className="form-section-card half-width">
              <CustomerInfo
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
              />
              <AddressInfo />
            </div>

            {/* Order/extra Info */}
            <div className="form-section-card half-width">
              <OrderInfo />
              <ExtraInfo />
            </div>
          </div>

          {/* Search + History/Products */}
          <div className="form-container">
            <div className="form-left search-order">
              <CustomerList
                customers={customers}
                onRowDoubleClicked={handleCustomerRowSelect}
              />
              <ShipStationTracks shipStationTracks={[]} />
            </div>
            <div className="form-left ship-product">
              <OrderHistory
                orders={orders}
                customer_id={selectedCustomer?.id}
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

          <div className="form-section-card">
            <h3 className="section-title">Attachments</h3>
            {/* fileType + uploads still in local state */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default CaseForm;

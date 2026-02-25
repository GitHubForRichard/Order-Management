import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@mui/material";

import ShipStationTracks from "../ShipStationTracks";
import CustomerInfo from "./components/CustomerInfo";
import AddressInfo from "./components/AddressInfo";
import OrderInfo from "./components/OrderInfo";
import ExtraInfo from "./components/ExtraInfo";
import CaseDetail from "./components/CaseDetail";

import { CASE_FORM_ACTION_TYPES } from "../../constants";

import CaseList from "../CaseList";
import Attachments from "./Attachments";
import { defaultValues } from "./NewCaseForm";
import CaseHistoryLog from "../CaseHistoryLog";
import {
  useUpdateCaseAttachmentsMutation,
  useUpdateCaseMutation,
} from "rtk/casesApi";

const ExistCaseForm = () => {
  const methods = useForm({
    defaultValues,
    mode: "onBlur",
  });

  const [selectedCase, setSelectedCase] = React.useState<any | null>(null);
  const [filesToRemove, setFilesToRemove] = React.useState<string[]>([]);

  const [updateCase, { isLoading: isUpdatingCase }] = useUpdateCaseMutation();
  const [updateCaseAttachments, { isLoading: isUpdatingCaseAttachments }] =
    useUpdateCaseAttachmentsMutation();

  const onFormUpdate = async (data: any) => {
    try {
      await updateCase({
        caseId: selectedCase.id,
        body: data,
      }).unwrap();

      const attachmentsField = methods.getValues("attachments");
      if (filesToRemove.length > 0 || attachmentsField?.length > 0) {
        await updateCaseAttachments({
          caseId: selectedCase.id,
          filesToRemove: filesToRemove,
          filesToAdd: attachmentsField,
        });

        methods.setValue("attachments", []);
      }
    } catch (error) {
      console.error("There was an error updating the case!", error);
    }
  };

  const handleCaseRowSelect = (row) => {
    setSelectedCase(row);
    methods.reset({
      ...row,
      first_name: row.customer.first_name,
      last_name: row.customer.last_name,
      middle_name: row.customer.middle_name,
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
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFormUpdate)}>
        <CaseList onRowDoubleClicked={handleCaseRowSelect} />
        <div className="form-container">
          <div className="form-left">
            <div className="form-row">
              <div className="form-section-card half-width">
                <CustomerInfo
                  caseFormActionType={CASE_FORM_ACTION_TYPES.EXIST}
                  selectedCustomer={null}
                  setSelectedCustomer={() => {}}
                  disabled={!selectedCase}
                />
                <AddressInfo disabled={!selectedCase} />
              </div>

              <div className="form-section-card half-width">
                <OrderInfo
                  caseFormActionType={CASE_FORM_ACTION_TYPES.EXIST}
                  disabled={!selectedCase}
                />
                <ExtraInfo disabled={!selectedCase} />
              </div>
            </div>
            <div className="form-container">
              <div className="form-left search-case">
                <ShipStationTracks trackingNumber={selectedCase?.tracking} />
              </div>
              <div className="form-left ship-product">
                <Attachments
                  selectedCase={selectedCase}
                  filesToRemove={filesToRemove}
                  setFilesToRemove={setFilesToRemove}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-right sticky-right">
            <div className="form-section-card">
              <CaseDetail />

              <div className="action-buttons">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !selectedCase || isUpdatingCase || isUpdatingCaseAttachments
                  }
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
        <CaseHistoryLog caseId={selectedCase?.id} />
      </form>
    </FormProvider>
  );
};

export default ExistCaseForm;

import React from "react";

import { CASE_FORM_ACTION_TYPES } from "../../constants";

import NewCaseForm from "components/CaseForm/NewCaseForm";
import ExistCaseForm from "components/CaseForm/ExistCaseForm";

import "./HomePage.css";

function HomePage() {
  const [currentPage, setCurrentPage] = React.useState(
    CASE_FORM_ACTION_TYPES.NEW
  );

  return (
    <div className="App">
      <>
        <div className="header">
          <img src="/logo_company.jpg" alt="Logo" className="logo" />
          <h2 className="title">Customer Services</h2>
          <div className="spacer" />
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: "40px",
            gap: "5px",
            marginBottom: "5px",
          }}
        >
          <div
            className={`tab ${
              currentPage === CASE_FORM_ACTION_TYPES.NEW ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage(CASE_FORM_ACTION_TYPES.NEW);
            }}
          >
            New Case
          </div>
          <div
            className={`tab ${
              currentPage === CASE_FORM_ACTION_TYPES.EXIST ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage(CASE_FORM_ACTION_TYPES.EXIST);
            }}
          >
            Existing Case
          </div>
        </div>
        {currentPage === CASE_FORM_ACTION_TYPES.NEW && <NewCaseForm />}
        {currentPage === CASE_FORM_ACTION_TYPES.EXIST && <ExistCaseForm />}
      </>
    </div>
  );
}

export default HomePage;

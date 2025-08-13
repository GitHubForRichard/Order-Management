import React from "react";
import "./App.css";

import { CASE_FORM_ACTION_TYPES } from "./constants";

import CaseForm from "./components/CaseForm/CaseForm";

function App() {
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  const [currentPage, setCurrentPage] = React.useState(
    CASE_FORM_ACTION_TYPES.NEW
  );

  return (
    <div className="App">
      <div className="header">
        <img src="/logo_company.jpg" alt="Logo" className="logo" />
        <h2 className="title">Customer Services</h2>
        <div className="spacer" />
      </div>
      <div className="user-info-banner">
        Logged in: <strong>{loggedInUser}</strong>
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
          Exist Case
        </div>
      </div>
      {currentPage === CASE_FORM_ACTION_TYPES.NEW && (
        <CaseForm actionType={CASE_FORM_ACTION_TYPES.NEW} />
      )}
      {currentPage === CASE_FORM_ACTION_TYPES.EXIST && (
        <CaseForm actionType={CASE_FORM_ACTION_TYPES.EXIST} />
      )}
    </div>
  );
}

export default App;

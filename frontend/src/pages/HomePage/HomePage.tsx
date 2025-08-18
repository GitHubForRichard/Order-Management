import React from "react";

import { CASE_FORM_ACTION_TYPES } from "../../constants";

import NewCaseForm from "components/CaseForm/NewCaseForm";
import ExistCaseForm from "components/CaseForm/ExistCaseForm";

import { useAuth } from "hooks/useAuth";
import "./HomePage.css";

function HomePage() {
  const { user, setAuth } = useAuth();
  const [currentPage, setCurrentPage] = React.useState(
    CASE_FORM_ACTION_TYPES.NEW
  );

  const handleLogout = () => {
    setAuth(null, null);
  };

  return (
    <div className="App">
      <>
        <div className="header">
          <img src="/logo_company.jpg" alt="Logo" className="logo" />
          <h2 className="title">Customer Services</h2>
          <div className="spacer" />
          <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
            Logout
          </button>
        </div>
        <div className="user-info-banner">
          Logged in:{" "}
          <strong>
            {user.first_name} {user.last_name}
          </strong>
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
        {currentPage === CASE_FORM_ACTION_TYPES.NEW && <NewCaseForm />}
        {currentPage === CASE_FORM_ACTION_TYPES.EXIST && <ExistCaseForm />}
      </>
    </div>
  );
}

export default HomePage;

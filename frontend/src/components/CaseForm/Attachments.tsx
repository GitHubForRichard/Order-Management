import React from "react";

import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";

import api from "../../api";
import { CASE_FORM_ACTION_TYPES } from "../../constants";
const Attachments = ({ caseFormActionType, selectedCase }) => {
  const { control } = useFormContext();

  const [attachments, setAttachments] = React.useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (selectedCase) {
      const fetchAttachments = async () => {
        try {
          const response = await api.get(`files/${selectedCase.id}`);
          setAttachments(response.data.files);
        } catch (error) {
          console.error("Error fetching attachments:", error);
        }
      };

      fetchAttachments();
    }
  }, [selectedCase]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

  return (
    <div className="form-section-card">
      <h3 className="section-title">Attachments</h3>
      {caseFormActionType === CASE_FORM_ACTION_TYPES.NEW && (
        <>
          <Controller
            name="attachments"
            control={control}
            render={({ field }) => (
              <>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept={acceptedFileTypes.join(",")}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      field.onChange(files);
                      setSelectedFiles(files);
                    }}
                  />
                </Button>
                <div style={{ marginTop: "1rem" }}>
                  <ul>
                    {selectedFiles.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          />
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </>
      )}
      {caseFormActionType === CASE_FORM_ACTION_TYPES.EXIST && (
        <div>
          {attachments.map((file) => (
            <div key={file.name}>
              <a href={file.url}>{file.name}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attachments;

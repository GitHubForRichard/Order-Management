import React from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Controller, useFormContext } from "react-hook-form";

import api from "../../api";

interface AttachmentsProps {
  selectedCase: any;
  filesToRemove?: string[];
  setFilesToRemove?: React.Dispatch<React.SetStateAction<string[]>>;
}

const Attachments: React.FC<AttachmentsProps> = ({
  selectedCase,
  filesToRemove,
  setFilesToRemove,
}) => {
  const { control, setValue, watch } = useFormContext();

  const [attachments, setAttachments] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (selectedCase?.id) {
      const fetchAttachments = async () => {
        const res = await api.get(`files/${selectedCase.id}`);
        setAttachments(res.data.files);
      };
      fetchAttachments();
    }
  }, [selectedCase]);

  const acceptedFileTypes = ["image/png", "image/jpeg", "application/pdf"];

  return (
    <div className="form-section-card">
      <h3 className="section-title">Attachments</h3>
      <Controller
        name="attachments"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            {attachments.map((file) => (
              <div key={file.id} style={{ display: "flex", gap: "8px" }}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {filesToRemove.includes(file.id) ? (
                    <s>{file.name}</s>
                  ) : (
                    file.name
                  )}
                </a>
                <Button
                  size="small"
                  color={filesToRemove.includes(file.id) ? "inherit" : "error"}
                  onClick={() =>
                    setFilesToRemove((prev) =>
                      prev.includes(file.id)
                        ? prev.filter((id) => id !== file.id)
                        : [...prev, file.id]
                    )
                  }
                >
                  {filesToRemove.includes(file.id) ? "Undo" : "Remove"}
                </Button>
              </div>
            ))}

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
                  const newFiles = Array.from(e.target.files);
                  field.onChange([...(field.value || []), ...newFiles]);
                }}
              />
            </Button>

            {field.value?.length > 0 && (
              <ul>
                {field.value.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </>
        )}
      />
    </div>
  );
};

export default Attachments;

export type UploadCaseAttachmentsRequest = {
  caseId: string;
  files: File[];
};

export type UpdateCaseAttachmentsRequest = {
  caseId: string;
  filesToAdd?: File[];
  filesToRemove?: string[];
};

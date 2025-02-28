//  payload for doConnection
export const connectionPayload = (loginUserName) => ({
  LoginUserName: loginUserName,
});

// Payload for DMS_CreateAndSave_DMS_Master
export const createDmsMasterPayload = (formData) => ({
  REF_SEQ_NO: formData.REF_SEQ_NO, // long
  DOCUMENT_NO: formData.DOCUMENT_NO, // string
  DOCUMENT_DESCRIPTION: formData.DOCUMENT_DESCRIPTION, // string
  DOC_SOURCE_FROM: formData.DOC_SOURCE_FROM, // string
  DOC_RELATED_TO: formData.DOC_RELATED_TO, // string
  DOC_RELATED_CATEGORY: formData.DOC_RELATED_CATEGORY, // string
  DOC_REF_VALUE: formData.DOC_REF_VALUE, // string
  USER_NAME: formData.USER_NAME, // string
  COMMENTS: formData.COMMENTS, // string
  DOC_TAGS: formData.DOC_TAGS, // string (comma-separated)
  FOR_THE_USERS: formData.FOR_THE_USERS, // string (comma-separated)
  EXPIRY_DATE: formData.EXPIRY_DATE, // string (ISO date or as required)
  REF_TASK_ID: formData.REF_TASK_ID, // long
});

// Payload for DMS_CreateAndSave_DMS_Details
export const createDmsDetailsPayload = ({
  refSeqNo,
  serialNo,
  documentNo,
  documentDescription,
  docSourceFrom,
  docRelatedTo,
  docRelatedCategory,
  docRefValue,
  userName,
  comments,
  docTags,
  forTheUsers,
  expiryDate,
  docData,
  docName,
  docExt,
  filePath,
}) => ({
  REF_SEQ_NO: refSeqNo, // long
  SERIAL_NO: serialNo, // short
  DOCUMENT_NO: documentNo, // string
  DOCUMENT_DESCRIPTION: documentDescription, // string
  DOC_SOURCE_FROM: docSourceFrom, // string
  DOC_RELATED_TO: docRelatedTo, // string
  DOC_RELATED_CATEGORY: docRelatedCategory, // string
  DOC_REF_VALUE: docRefValue, // string
  USER_NAME: userName, // string
  COMMENTS: comments, // string
  DOC_TAGS: docTags, // string (comma-separated)
  FOR_THE_USERS: forTheUsers, // string (comma-separated)
  EXPIRY_DATE: expiryDate, // string (ISO date or as required)
  DOC_DATA: docData, // base64Binary
  DOC_NAME: docName, // string
  DOC_EXT: docExt, // string
  FILE_PATH: filePath, // string
});

// Payload for DataModel_GetData
export const getDataModelPayload = ({
  dataModelName,
  whereCondition,
  orderby,
}) => ({
  DataModelName: dataModelName, // string
  WhereCondition: whereCondition, // string
  Orderby: orderby, // string
});

// Payload for IM_Get_All_Users
// No parameters needed – returns an empty object.
export const getAllUsersPayload = () => ({});

// Payload for IM_Get_User_Tasks
export const getUserTasksPayload = ({ userName }) => ({
  USER_NAME: userName, // string
});

// Payload for getpic (or getpic_bytearray)
export const getEmployeePicturePayload = ({ empNo }) => ({
  EmpNo: empNo, // string
});

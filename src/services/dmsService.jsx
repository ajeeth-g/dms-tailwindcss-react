import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import { createDmsMasterPayload } from "./payloadBuilders";
import soapClient from "./soapClient";

// Helper: Use proxy endpoint if in development.
const getEndpoint = (dynamicURL) => {
  if (
    process.env.NODE_ENV === "development" &&
    dynamicURL &&
    dynamicURL.includes("103.168.19.35")
  ) {
    return "/api";
  }
  return dynamicURL;
};

const DEFAULT_SOAP_URL = "/api";

// Create, modify & save DMS master record.
export const createAndSaveDMSMaster = async (
  formData,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);

  // Build the payload dynamically using the builder function
  const payload = createDmsMasterPayload(formData);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_CreateAndSave_DMS_Master";
  const soapBody = createSoapEnvelope("DMS_CreateAndSave_DMS_Master", payload);

  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DMS_CreateAndSave_DMS_Master"
  );
  return parsedResponse;
};

// Create, modify & save DMS detail record.
export const createAndSaveDMSDetails = async (
  payload,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_CreateAndSave_DMS_Details";
  const soapBody = createSoapEnvelope("DMS_CreateAndSave_DMS_Details", payload);
  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DMS_CreateAndSave_DMS_Details"
  );
  return parsedResponse;
};

// Create, modify & save DMS detail record.
export const getDocMasterList = async (
  payload,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_GetDocMaster_List";
  const soapBody = createSoapEnvelope("DMS_GetDocMaster_List", payload);
  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DMS_GetDocMaster_List"
  );
  return parsedResponse;
};

// Delete DMS master record.
export const deleteDMSMaster = async (
  payload,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_Delete_DMS_Master";
  const soapBody = createSoapEnvelope("DMS_Delete_DMS_Master", payload);
  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DMS_Delete_DMS_Master"
  );
  return parsedResponse;
};

// Delete DMS details record.
export const deleteDMSDetails = async (
  payload,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_Delete_DMS_Detail";
  const soapBody = createSoapEnvelope("DMS_Delete_DMS_Detail", payload);
  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "DMS_Delete_DMS_Detail"
  );
  return parsedResponse;
};

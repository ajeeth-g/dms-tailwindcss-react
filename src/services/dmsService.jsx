import { createSoapEnvelope } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import { createDmsMasterPayload } from "./payloadBuilders";
import soapClient from "./soapClient";

const SOAP_URL = "/api";

// Create, modify & save DMS master record.
export const createAndSaveDMSMaster = async (formData) => {
  // Build the payload dynamically using the builder function
  const payload = createDmsMasterPayload(formData);

  const doConnectionResponse = await doConnection();
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_CreateAndSave_DMS_Master";
  const soapBody = createSoapEnvelope("DMS_CreateAndSave_DMS_Master", payload);

  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

// Create, modify & save DMS detail record.
export const createAndSaveDMSDetails = async (payload) => {
  const doConnectionResponse = await doConnection();
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DMS_CreateAndSave_DMS_Details";
  const soapBody = createSoapEnvelope("DMS_CreateAndSave_DMS_Details", payload);
  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

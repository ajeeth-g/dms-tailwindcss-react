import soapClient from "./soapClient";
import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { getDataModelPayload } from "./payloadBuilders";
import { doConnection } from "./connectionService";

const SOAP_URL = "/api";

export const getDataModel = async (para) => {
  // Build the payload dynamically using the builder function
  const payload = getDataModelPayload(para);

  const doConnectionResponse = await doConnection();
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/DataModel_GetData";
  const soapBody = createSoapEnvelope("DataModel_GetData", payload);

  // Await the SOAP client call before parsing the response.
  const soapResponse = await soapClient(SOAP_URL, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(soapResponse);
  return parsedResponse;
};

// src/services/employeeService.js
import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import {
  getEmployeeImagePayload,
  getEmployeeNameAndIdPayload,
} from "./payloadBuilders";
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

// Retrieves employee name and ID.
export const getEmployeeNameAndId = async (
  employeeName,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);
  const payload = getEmployeeNameAndIdPayload(employeeName);

  // Authenticate via doConnection using the chosen endpoint.
  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/getemployeename_and_id";
  const soapBody = createSoapEnvelope("getemployeename_and_id", payload);

  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "getemployeename_and_id"
  );
  return parsedResponse;
};

// Retrieves employee image.
export const getEmployeeImage = async (
  employeeNo,
  email,
  dynamicURL = DEFAULT_SOAP_URL
) => {
  const endpoint = getEndpoint(dynamicURL);
  const payload = getEmployeeImagePayload(employeeNo);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/getpic";
  const soapBody = createSoapEnvelope("getpic", payload);

  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(soapResponse, "getpic");
  return parsedResponse;
};

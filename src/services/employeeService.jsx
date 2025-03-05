// src/services/employeeService.js
import { createSoapEnvelope, parseDataModelResponse } from "../utils/soapUtils";
import { doConnection } from "./connectionService";
import {
  getAllEmployeeDetailsPayload,
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
  console.log(soapResponse);

  const parsedResponse = parseDataModelResponse(soapResponse, "getpic");

  return parsedResponse;
};

// Retrieves employee details.
export const getAllUsers = async (email, dynamicURL = DEFAULT_SOAP_URL) => {
  const endpoint = getEndpoint(dynamicURL);
  const payload = getAllEmployeeDetailsPayload(email);

  const doConnectionResponse = await doConnection(endpoint, email);
  if (doConnectionResponse === "ERROR") {
    throw new Error("Connection failed: Unable to authenticate.");
  }

  const SOAP_ACTION = "http://tempuri.org/IM_Get_All_Users";
  const soapBody = createSoapEnvelope("IM_Get_All_Users", payload);

  const soapResponse = await soapClient(endpoint, SOAP_ACTION, soapBody);
  const parsedResponse = parseDataModelResponse(
    soapResponse,
    "IM_Get_All_Users"
  );
  return parsedResponse;
};

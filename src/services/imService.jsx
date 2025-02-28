import soapClient from "./soapClient";
import { createSoapEnvelope } from "../utils/soapUtils";

const SOAP_URL = "https://your-soap-endpoint.com/soap"; // Replace with your actual endpoint

// Get all employee/user details.
export const getAllUsers = async () => {
  const SOAP_ACTION = "http://tempuri.org/IM_Get_All_Users";
  const soapBody = createSoapEnvelope("IM_Get_All_Users");
  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

// Get tasks for a specific user.
export const getUserTasks = async (payload) => {
  const SOAP_ACTION = "http://tempuri.org/IM_Get_User_Tasks";
  const soapBody = createSoapEnvelope("IM_Get_User_Tasks", payload);
  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

// Get employee picture (method named "getpic").
export const getEmployeePicture = async (empNo) => {
  const SOAP_ACTION = "http://tempuri.org/getpic";
  const soapBody = createSoapEnvelope("getpic", { EmpNo: empNo });
  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

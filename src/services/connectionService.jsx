import { getUserEmail } from "../context/AuthContext";
import { createSoapEnvelope } from "../utils/soapUtils";
import { connectionPayload } from "./payloadBuilders";
import soapClient from "./soapClient";

const SOAP_URL = "/api";

export const doConnection = async () => {
  const loginUserName = getUserEmail();

  if (!loginUserName) {
    console.error(
      "❌ Login user name is required for doConnection authentication."
    );
    return "ERROR";
  }

  const SOAP_ACTION = "http://tempuri.org/doConnection";
  const payload = connectionPayload(loginUserName);
  const soapBody = createSoapEnvelope("doConnection", payload);
  return soapClient(SOAP_URL, SOAP_ACTION, soapBody);
};

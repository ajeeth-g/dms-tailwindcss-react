import axios from "axios";
import { getUserEmail } from "../context/AuthContext";

export const doConnection = async () => {
  const email = getUserEmail();
  if (!email) {
    console.error("❌ Email is required for authentication.");
    return "ERROR";
  }

  const soapRequest = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
  <web:doConnection>
  <web:LoginUserName>${email}</web:LoginUserName>
  </web:doConnection>
  </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const response = await axios.post(
      "/api", // Use Vite proxy
      soapRequest,
      {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "http://tempuri.org/doConnection",
        },
      }
    );

    // Parse XML Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const result =
      xmlDoc.getElementsByTagName("doConnectionResult")[0]?.textContent;
    return result || "DoConnection FAILED";
  } catch (error) {
    console.error(
      "❌ Error connecting:",
      error?.response?.data || error.message
    );
    return "ERROR";
  }
};

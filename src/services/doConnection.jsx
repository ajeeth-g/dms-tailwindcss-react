import axios from "axios";

const doConnection = async (loginUserName) => {
  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <web:doConnection>
          <web:LoginUserName>${loginUserName}</web:LoginUserName>
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
          "SOAPAction": "http://tempuri.org/doConnection",
        },
      }
    );

    // console.log("🔹 Full SOAP Response:", response.data);

    // Parse XML Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const result = xmlDoc.getElementsByTagName("doConnectionResult")[0]?.textContent;

    // console.log("🔹 Parsed Connection Result:", result);

    return result || "FAILED";
  } catch (error) {
    console.error("❌ Error connecting:", error?.response?.data || error.message);
    return "ERROR";
  }
};

export default doConnection;

import axios from "axios";

const getpic = async (empNo) => {
  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <web:getpic>
          <web:EmpNo>${empNo}</web:EmpNo>
        </web:getpic>
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
          SOAPAction: "http://tempuri.org/getpic",
        },
      }
    );

    // console.log("🔹 getPic Response:", response.data);

    // Parse XML Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const base64String =
      xmlDoc.getElementsByTagName("getpicResult")[0]?.textContent;

    return base64String ? `data:image/png;base64,${base64String}` : null;
  } catch (error) {
    console.error(
      "❌ Error fetching picture:",
      error?.response?.data || error.message
    );
    return null;
  }
};

export default getpic;

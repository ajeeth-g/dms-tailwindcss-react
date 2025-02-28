import axios from "axios";

const getEmployeeNameAndId = async (userFirstName) => {
  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://tempuri.org/">
      <soapenv:Header/>
      <soapenv:Body>
        <web:getemployeename_and_id>
          <web:userfirstname>${userFirstName}</web:userfirstname>
        </web:getemployeename_and_id>
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
          SOAPAction: "http://tempuri.org/getemployeename_and_id",
        },
      }
    );

    // Parse XML Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");
    const employeeName =
      xmlDoc.getElementsByTagName("EmployeeName")[0]?.textContent;
    const employeeId =
      xmlDoc.getElementsByTagName("EmployeeID")[0]?.textContent;

    return { employeeName, employeeId };
  } catch (error) {
    console.error(
      "❌ Error fetching employee details:",
      error?.response?.data || error.message
    );
    return null;
  }
};

export default getEmployeeNameAndId;

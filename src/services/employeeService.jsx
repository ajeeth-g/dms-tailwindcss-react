import axios from "axios";
import doConnection from "./doConnection"; // Import doConnection function

const getAllUsers = async (userName = "gopi@demo.com") => {
  try {
    // Step 1: Establish Connection
    const connectionStatus = await doConnection(userName);

    if (connectionStatus !== "SUCCESS") {
      console.error("❌ Connection failed. Unable to fetch users.");
      return null;
    }

    console.log("✅ Connection successful. Fetching users...");

    // Step 2: Proceed with fetching users
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://tempuri.org/">
        <soapenv:Header/>
        <soapenv:Body>
          <web:IM_Get_All_Users>
            <web:UserName>${userName}</web:UserName>
          </web:IM_Get_All_Users>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const response = await axios.post(
      "/api", // Assuming you use a Vite proxy for API calls
      soapRequest,
      {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "http://tempuri.org/IM_Get_All_Users",
        },
      }
    );

    // Parse XML Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");

    // Extract actual result content
    const usersData = xmlDoc.getElementsByTagName("IM_Get_All_UsersResult")[0]
      ?.textContent;

    // Ensure valid JSON before parsing
    if (
      !usersData ||
      (!usersData.trim().startsWith("{") && !usersData.trim().startsWith("["))
    ) {
      console.error("❌ Received data is not valid JSON:", usersData);
      return null;
    }

    return JSON.parse(usersData);
  } catch (error) {
    console.error(
      "❌ Error fetching users:",
      error?.response?.data || error.message
    );
    return null;
  }
};

export default getAllUsers;

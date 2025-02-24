import axios from "axios";
import doConnection from "./doConnection"; // Import doConnection function

const createTask = async ({
  UserName,
  Subject,
  Details,
  RelatedTo,
  AssignedUser,
  CreatorReminderOn,
  StartDate,
  CompDate,
  RemindTheUserOn,
  userName = "gopi@demo.com",
}) => {
  try {
    // Step 1: Establish Connection
    const connectionStatus = await doConnection(userName);

    if (connectionStatus !== "SUCCESS") {
      console.error("❌ Connection failed. Task creation aborted.");
      return null;
    }

    console.log("✅ Connection successful. Proceeding with task creation...");

    // Step 2: Proceed with SOAP Task Creation
    const soapAction = "http://tempuri.org/IM_Task_Create";
    const url = "/api"; // Use proxy in Vite or define the actual endpoint

    // Formatting SOAP request
    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <IM_Task_Create xmlns="http://tempuri.org/">
          <UserName>${UserName}</UserName>
          <Subject>${Subject}</Subject>
          <Details>${Details}</Details>
          <RelatedTo>${RelatedTo}</RelatedTo>
          <AssignedUser>${AssignedUser}</AssignedUser>
          <CreatorReminderOn>${CreatorReminderOn}</CreatorReminderOn>
          <StartDate>${StartDate}</StartDate>
          <CompDate>${CompDate}</CompDate>
          <RemindTheUserOn>${RemindTheUserOn}</RemindTheUserOn>
        </IM_Task_Create>
      </soap:Body>
    </soap:Envelope>`;

    const response = await axios.post(url, soapBody, {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: soapAction,
      },
    });

    return response.data; // SOAP Response in XML format
  } catch (error) {
    console.error("❌ SOAP request error:", error.message);
    return null;
  }
};

export default createTask;

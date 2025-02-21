export const saveService = async (formattedData) => {
  const soapAction = "http://tempuri.org/DataModel_SaveData";
  const url = "/api";

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <DataModel_SaveData xmlns="http://tempuri.org/">
        <UserName>gopi@demo.com</UserName>
        <DModelData>${formattedData}</DModelData>
      </DataModel_SaveData>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: soapAction,
      },
      body: soapBody,
    });

    const textResponse = await response.text();

    console.log("🔹 Save Response:", textResponse);

    return textResponse; // XML response
  } catch (error) {
    console.error(`SOAP request error: ${error}`);
    return null;
  }
};

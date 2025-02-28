export const createSoapEnvelope = (method, params = {}) => {
  let paramsXML = "";
  Object.entries(params).forEach(([key, value]) => {
    paramsXML += `<${key}>${value}</${key}>`;
  });

  return `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <${method} xmlns="http://tempuri.org/">
            ${paramsXML}
          </${method}>
        </soap:Body>
      </soap:Envelope>
    `;
};

// Helper: Parse the SOAP XML response to extract the JSON result.
export const parseDataModelResponse = (soapResponse) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(soapResponse, "text/xml");
    // Locate the node containing the result.
    const resultNode = xmlDoc.getElementsByTagName(
      "DataModel_GetDataResult"
    )[0];
    if (resultNode) {
      const jsonStr = resultNode.textContent;
      // Parse the JSON string into an array.
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error("Error parsing SOAP response:", e);
  }
  return [];
};

// Helper function to parse the service date format
export const parseServiceDate = (dateString) => {
  // Extract the timestamp from the service date format
  const match = /\/Date\((\d+)\)\//.exec(dateString);
  if (match) {
    const timestamp = Number(match[1]);
    const date = new Date(timestamp);

    // Format date as "DD-MMM-YYYY"
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short", // Short month name (e.g., Jan, Feb, Mar)
        year: "numeric",
      })
      .replace(",", ""); // Remove the comma for correct format
  } else {
    console.log("no date");
  }
  return dateString; // Return as-is if it doesn't match the expected format
};

// Helper function to convert file to base64 string
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // The result is like "data:<mime-type>;base64,<base64-string>"
      // We extract the part after the comma.
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

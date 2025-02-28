export const saveDMSMaster = async (data) => {
    const soapAction = "http://tempuri.org/DMS_CreateAndSave_DMS_Master";
    const url = "/api";
  
    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <DMS_CreateAndSave_DMS_Master xmlns="http://tempuri.org/">
          <REF_SEQ_NO>${data.REF_SEQ_NO}</REF_SEQ_NO>
          <DOCUMENT_NO>${data.DOCUMENT_NO}</DOCUMENT_NO>
          <DOCUMENT_DESCRIPTION>${data.DOCUMENT_DESCRIPTION}</DOCUMENT_DESCRIPTION>
          <DOC_SOURCE_FROM>${data.DOC_SOURCE_FROM}</DOC_SOURCE_FROM>
          <DOC_RELATED_TO>${data.DOC_RELATED_TO}</DOC_RELATED_TO>
          <DOC_RELATED_CATEGORY>${data.DOC_RELATED_CATEGORY}</DOC_RELATED_CATEGORY>
          <DOC_REF_VALUE>${data.DOC_REF_VALUE}</DOC_REF_VALUE>
          <USER_NAME>${data.USER_NAME}</USER_NAME>
          <COMMENTS>${data.COMMENTS}</COMMENTS>
          <DOC_TAGS>${data.DOC_TAGS}</DOC_TAGS>
          <FOR_THE_USERS>${data.FOR_THE_USERS}</FOR_THE_USERS>
          <EXPIRY_DATE>${data.EXPIRY_DATE}</EXPIRY_DATE>
          <REF_TASK_ID>${data.REF_TASK_ID}</REF_TASK_ID>
        </DMS_CreateAndSave_DMS_Master>
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
      console.log(textResponse);
  
      return textResponse; // XML response
    } catch (error) {
      console.error(`SOAP request error: ${error}`);
      return null;
    }
  };
  
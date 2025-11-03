function doGet(_e: any) {
  return HtmlService.createHtmlOutputFromFile("html/index");
}

//aaa
export const getClients = () => {
  try {
    const sheet = SpreadsheetApp.openById(
      "1RkayP5I09BmJmT6A77nEQdbU0g4wedsxy0KRitpSKSY"
    );
    const sheetData = sheet.getSheetByName("controle de produtos");
    const data = sheetData?.getDataRange().getValues();

    interface data {
      id: string;
      productName: string;
      quantity: number;
      price: number;
    }
    const clients: data[] = [];

    if (!data) {
      return console.log("No data found.");
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      clients.push({
        id: row[0].toString(),
        productName: row[1].toString(),
        quantity: Number(row[2]),
        price: Number(row[3]),
      });
    }
    Logger.log(clients);
    return clients;
  } catch (error) {
    console.error("Error fetching clients eeeeeeerro:", error);
    throw error;
  }
};

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
      // Identificação
      id: string;
      status: string;
      productName: string;
      category: string;

      // Especificações do Produto
      type: string; // Tipo de café (Arábica, Robusta, etc.) ou pimenta (Jalapeño, Malagueta, etc.)
      variety: string; // Variedade específica (ex: Bourbon, Conilon)
      origin: string; // Origem/procedência
      roastLevel: string; // Para café
      spiceLevel: string; // Para pimenta

      // Estoque
      quantity: string;
      unit: string;
      minStock: string; // Estoque mínimo (alerta)
      maxStock: string; // Estoque máximo

      // Financeiro
      purchasePrice: string; // Preço de compra
      salePrice: string; // Preço de venda
      profitMargin: string; // Margem de lucro %

      // Fornecedor
      supplier: string;
      supplierContact: string;

      // Datas
      purchaseDate: string;
      expiryDate: string; // Validade
      harvestDate: string; // Data da colheita
      roastDate: string; // Data da torra (para café)

      // Localização
      warehouse: string; // Armazém/depósito
      shelf: string; // Prateleira/localização física

      // Qualidade
      qualityGrade: string; // Classificação
      certifications: string; // Certificações (orgânico, comércio justo, etc.)

      // Rastreabilidade
      batch: string; // Lote
      invoiceNumber: string; // Número da nota fiscal

      // Observações
      notes: string;

      // Controle
      createdAt: string;
      updatedAt: string;
      createdBy: string;
    }
    const clients: data[] = [];

    if (!data) {
      return console.log("No data found.");
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      clients.push({
        // Identificação (0-2)
        id: String(row[0] || ""),
        status: String(row[1] || ""),
        productName: String(row[2] || ""),
        category: String(row[3] || ""),

        // Especificações do Produto (4-8)
        type: String(row[4] || ""),
        variety: String(row[5] || ""),
        origin: String(row[6] || ""),
        roastLevel: String(row[7] || ""),
        spiceLevel: String(row[8] || ""),

        // Estoque (9-12)
        quantity: String(row[9] || ""),
        unit: String(row[10] || ""),
        minStock: String(row[11] || ""),
        maxStock: String(row[12] || ""),

        // Financeiro (13-15)
        purchasePrice: String(row[13] || ""),
        salePrice: String(row[14] || ""),
        profitMargin: String(row[15] || ""),

        // Fornecedor (16-17)
        supplier: String(row[16] || ""),
        supplierContact: String(row[17] || ""),

        // Datas (18-21)
        purchaseDate: String(row[18] || ""),
        expiryDate: String(row[19] || ""),
        harvestDate: String(row[20] || ""),
        roastDate: String(row[21] || ""),

        // Localização (22-23)
        warehouse: String(row[22] || ""),
        shelf: String(row[23] || ""),

        // Qualidade (24-25)
        qualityGrade: String(row[24] || ""),
        certifications: String(row[25] || ""),
        // Rastreabilidade (26-27)
        batch: String(row[26] || ""),
        invoiceNumber: String(row[27] || ""),

        // Observações (28)
        notes: String(row[28] || ""),

        // Controle (29-31)
        createdAt: String(row[29] || ""),
        updatedAt: String(row[30] || ""),
        createdBy: String(row[31] || ""),
      });
    }
    Logger.log(clients);
    return clients;
  } catch (error) {
    console.error("Error fetching clients eeeeeeerro:", error);
    throw error;
  }
};

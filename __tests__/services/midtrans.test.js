const axios = require("axios");
const {
  midtransCreateSnapTransaction,
  midtransVerifyTransaction,
  midtransCancelTransaction,
} = require("@/services/midtrans");

jest.mock("axios");

describe("Midtrans Service", () => {
  const serverKey = "Mid-server-D8CphT26Mc6q_wMdOeM3v28_";
  const snapUrl = "https://app.midtrans.com/snap/v1";
  const baseUrl = "https://api.midtrans.com/v2";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a snap transaction successfully", async () => {
    const transactionDetails = { order_id: "order-123", gross_amount: 100000 };
    const mockResponse = { data: { token: "dummy-token", redirect_url: "https://midtrans.com/redirect" } };
    axios.post.mockResolvedValue(mockResponse);

    const result = await midtransCreateSnapTransaction(transactionDetails);

    expect(axios.post).toHaveBeenCalledWith(
      `${snapUrl}/transactions`,
      transactionDetails,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Basic ${Buffer.from(serverKey + ":").toString("base64")}`,
        }),
      })
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle errors when creating a snap transaction", async () => {
    const transactionDetails = { order_id: "order-123", gross_amount: 100000 };
    axios.post.mockRejectedValue(new Error("API error"));

    await expect(midtransCreateSnapTransaction(transactionDetails)).rejects.toThrow("Failed to create snap transaction");
  });

  // Add similar tests for verify and cancel functions
});
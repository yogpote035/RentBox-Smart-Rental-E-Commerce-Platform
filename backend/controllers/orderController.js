const OrderModel = require("../model/orderModel");
const ProductModel = require("../model/productModel");
const { isBefore, isAfter, parseISO, format } = require("date-fns");
const PDFDocument = require("pdfkit");
const path = require("path");

module.exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, from, to } = req.body;
    const userId = req.headers.userid;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product and quantity are required." });
    }
    if (!from || !to) {
      return res.status(400).json({ message: "Renting Period is required." });
    }

    const newOrder = new OrderModel({
      product: productId,
      quantity,
      from: new Date(from),
      to: new Date(to),
      owner: userId,
    });

    await newOrder.save();

    await ProductModel.findByIdAndUpdate(productId, {
      $push: { orders: newOrder._id },
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.headers.userid;

    const orders = await OrderModel.find({ owner: userId })
      .populate("product")
      .populate("owner")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this order" });
    }
    const productId = order.product._id;
    await ProductModel.findByIdAndUpdate(productId, {
      $pull: { orders: orderId },
    });
    await OrderModel.findByIdAndDelete(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
};

module.exports.checkProductAvailability = async (req, res) => {
  try {
    const { productId, from, to } = req.body;

    const orders = await OrderModel.find({ product: productId });

    const requestedFrom = new Date(from);
    const requestedTo = new Date(to);

    const conflict = orders.some((order) => {
      const orderFrom = new Date(order.from);
      const orderTo = new Date(order.to);

      return requestedFrom <= orderTo && requestedTo >= orderFrom;
    });

    if (conflict) {
      const allToDates = orders.map((o) => new Date(o.to));
      const latestToDate = new Date(Math.max(...allToDates));

      const nextAvailable = new Date(latestToDate);
      nextAvailable.setDate(nextAvailable.getDate() + 1);

      return res.status(208).json({
        message: "Product already rented during selected period",
        nextAvailable,
      });
    }

    return res.json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking availability" });
  }
};
module.exports.receiptGenerate = async (req, res) => {
  try {
    const orderId = req?.query?.orderId;
    if (!orderId) {
      return res
        .status(404)
        .json({ message: "Order Id is Missing for Receipt Generation" });
    }
    const ReceiptOrder = await OrderModel.findById(orderId)
      .populate({
        path: "owner",
        populate: { path: "address" },
      })
      .populate({
        path: "product",
        populate: [
          { path: "owner", populate: { path: "address" } },
          { path: "address" },
        ],
      })
      .exec();

    if (!ReceiptOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Extract seller, buyer, product
    const seller = ReceiptOrder.product.owner;
    const buyer = ReceiptOrder.owner;
    const product = ReceiptOrder.product;

    const sellerAddress = seller?.address?.[0] || {};
    const buyerAddress = buyer?.address?.[0] || {};
    const shippingAddress = product?.address?.[0] || {};

    const PDFDocument = require("pdfkit");
    const path = require("path");

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ORD${orderId}.pdf`
    );

    doc.pipe(res);

    // Logo
    const logoPath = path.join(__dirname, "../public/logo.png");
    doc.image(logoPath, 50, 40, { height: 25, width: 80 });

    // Title
    doc
      .fontSize(20)
      .fillColor("black")
      .text("Tax Invoice", { align: "center" });

    // Seller Info
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("black")
      .text(`Sold By: ${seller.name}`, 50)
      .text(`Phone: ${seller.phone}`, 50)
      .text(
        `Ship-from Address: ${shippingAddress.landmark || ""}, ${
          shippingAddress.city || ""
        }, ${shippingAddress.state || ""}, ${shippingAddress.pincode || ""}`,
        50
      )
      .text("GSTIN: 27ABCDE1234F1Z5", 50);

    // Order Summary
    const orderSummary = {
      invoiceId: `RENT-${ReceiptOrder._id.toString().slice(-6).toUpperCase()}`,
      date: format(ReceiptOrder.createdAt, "dd-MM-yyy, hh:mm:ss a"),
      orderId: `ORD-${ReceiptOrder._id.toString().slice(-6).toUpperCase()}`,
      productId: product._id.toString(),
      productName: product.name,
      qty: ReceiptOrder.quantity,
      price: parseFloat(product.price), // assuming format is number
      from: ReceiptOrder.from,
      to: ReceiptOrder.to,
    };

    const totalPrice = orderSummary.qty * orderSummary.price;

    // Order Info
    doc.moveDown(2);
    doc
      .fontSize(10)
      .text(`Invoice ID: ${orderSummary.invoiceId}`)
      .text(`Date: ${orderSummary.date}`)
      .text(`Order ID: ${orderSummary.orderId}`)
      .text(`Product ID: ${orderSummary.productId}`);

    // Billing Info
    doc.moveDown(2);
    doc.font("Helvetica-Bold").text("Billed To:", { underline: true });
    doc
      .font("Helvetica")
      .text(buyer.name)
      .text(
        `${buyerAddress.landmark || ""}, ${buyerAddress.city || ""}, ${
          buyerAddress.state || ""
        }, ${buyerAddress.pincode || ""}`
      )
      .text(`Phone: ${buyer.phone}`);

    // Table Header
    doc.moveDown(2);
    const headers = {
      product: 50,
      qty: 280,
      price: 330,
      total: 410,
    };

    const tableTop = doc.y;
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Product Title", headers.product, tableTop);
    doc.text("Qty", headers.qty, tableTop);
    doc.text("Price (Rs.)", headers.price, tableTop);
    doc.text("Total (Rs.)", headers.total, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(500, tableTop + 15)
      .stroke();

    // Product Row
    const rowY = tableTop + 20;
    doc.font("Helvetica").fontSize(10);
    doc.text(orderSummary.productName, headers.product, rowY);
    doc.text(orderSummary.qty.toString(), headers.qty, rowY);
    doc.text(orderSummary.price.toFixed(2), headers.price, rowY);
    doc.text(totalPrice.toFixed(2), headers.total, rowY);

    // Divider
    doc
      .moveTo(50, rowY + 20)
      .lineTo(500, rowY + 20)
      .stroke();

    // Grand Total
    doc.moveDown(1.5);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Grand Total Rs. ${totalPrice.toFixed(2)}`, 50, doc.y, {
        align: "right",
      });

    // Rent Period
    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(11).text("Rent Period:", 50);

    const dateStatus = isBefore(ReceiptOrder.to, new Date());

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        `${format(orderSummary.from, "dd-MM-yyyy")} to ${format(
          orderSummary.to,
          "dd-MM-yyyy"
        )}`,
        130,
        doc.y - 15
      )
      .moveDown(1.5)
      .font("Helvetica-Bold")
      .text(
        `Renting Status: ${dateStatus ? "Expired" : "Active"}`,
        130,
        doc.y - 15
      );

    // Footer
    doc.moveDown(1);
    doc
      .font("Helvetica-Oblique")
      .fontSize(9)
      .fillColor("gray")
      .text("This is a computer-generated invoice. No signature required.")
      .moveDown(0.3)
      .font("Helvetica-Bold")
      .fillColor("black")
      .fontSize(10)
      .text("Contact RentIt: support@rentit.com | +91-1234567890")
      .moveDown(0.3)
      .text("Thank you for renting with us!");

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};

// Printer is only available in local/LAN environment, not on Vercel
let ThermalPrinter, PrinterTypes, CharacterSet;
try {
  const thermalPkg = require("node-thermal-printer");
  ThermalPrinter   = thermalPkg.ThermalPrinter;
  PrinterTypes     = thermalPkg.PrinterTypes;
  CharacterSet     = thermalPkg.CharacterSet;
} catch {
  // Not installed (Vercel cloud) — printer features disabled
}
const config = require("./config");

async function printKitchenOrder(order) {
  if (!ThermalPrinter) {
    // Running on Vercel cloud — printer not available, skip silently
    return false;
  }
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: `tcp://${config.printerIP}:${config.printerPort}`,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "-",
    options: {
      timeout: 3000,
    },
  });

  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      console.warn(`[PRINTER] ⚠️  Kitchen printer not reachable at ${config.printerIP}:${config.printerPort}. Order saved but not printed.`);
      return false;
    }

    const time = new Date(order.timestamp).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(order.timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println("*** DAPUR ***");
    printer.bold(false);
    printer.drawLine();

    printer.alignLeft();
    printer.bold(true);
    printer.println(`MEJA : ${order.tableNumber}`);
    printer.bold(false);
    printer.println(`Waktu: ${date} ${time}`);
    printer.println(`Order #${order.id}`);
    printer.drawLine();

    printer.bold(true);
    printer.println("PESANAN MAKANAN:");
    printer.bold(false);

    if (order.foodItems && order.foodItems.length > 0) {
      for (const item of order.foodItems) {
        printer.leftRight(`  ${item.name}`, `x${item.qty}`);
      }
    } else {
      printer.println("  (tidak ada pesanan makanan)");
    }

    printer.drawLine();
    printer.alignCenter();
    printer.println("Terima kasih!");
    printer.cut();

    await printer.execute();
    console.log(`[PRINTER] ✅ Kitchen receipt printed for Table ${order.tableNumber}`);
    return true;
  } catch (err) {
    console.error(`[PRINTER] ❌ Print failed: ${err.message}`);
    return false;
  }
}

module.exports = { printKitchenOrder };

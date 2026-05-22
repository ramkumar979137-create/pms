import { Request, Response } from "express";
import { getAllProperties } from "../Service/Property.service";
import { getAllCustomers } from "../Service/Customer.service";

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllProperties();
    const customers = await getAllCustomers();

    // Calculate stats
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => p.status === "Occupied").length;
    const activeTenants = customers.length;
    const openMaintenance = 0;
    const pendingInvoices = "₹0";

    const stats = [
      { label: "Total Properties", value: totalProperties.toString(), icon: "bi-building-fill", type: "maroon" },
      { label: "Active Tenants", value: activeTenants.toString(), icon: "bi-people-fill", type: "gold" },
      { label: "Open Maintenance", value: openMaintenance.toString(), icon: "bi-tools", type: "success" },
      { label: "Pending Invoices", value: pendingInvoices, icon: "bi-receipt-cutoff", type: "info" },
    ];

    const recentActivity: Array<{ type: string; desc: string; status: string; date: string }> = [];

    res.json({ stats, recentActivity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
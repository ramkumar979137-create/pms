import { Request, Response } from "express";
import { getAllProperties } from "../Service/Property.service";
import { getAllCustomers } from "../Service/Customer.service";

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const propertiesResult = await getAllProperties({ page: 1, limit: 100, search: "", type: "", status: "" });
    const customersResult = await getAllCustomers({ page: 1, limit: 100, search: "", type: "", status: "" });

    const properties = propertiesResult.items || [];
    const customers = customersResult.items || [];

    // Calculate stats
    const totalProperties = propertiesResult.total || 0;
    const occupiedProperties = properties.filter((p: any) => p.status === "OCCUPIED").length;
    const activeTenants = customersResult.total || 0;
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
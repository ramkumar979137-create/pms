import express from "express";
import path from "path";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./Routes/Auth.route";
import rentalRoutes from "./Routes/Rentalagreement.routes";
import cancellationRoutes from "./Routes/RentalCancellation.routes";
import leaseRoutes from "./Routes/LeaseAgreement.routes";
import leaseCancellationRoutes from "./Routes/LeaseCancellation.routes";
import customerRoutes from "./Routes/Customer.routes";
import propertyRoutes from "./Routes/Property.routes";
import dashboardRoutes from "./Routes/Dashboard.routes";
import cors from "cors";  



const app = express();
app.use(express.json());
app.use(cors());  
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", authRoutes);
app.use("/api/rental-agreements", rentalRoutes);
app.use("/api/rental-cancellations", cancellationRoutes);
app.use("/api/lease-agreements", leaseRoutes);
app.use("/api/lease-cancellations", leaseCancellationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/dashboard", dashboardRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB Connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err: any) => console.log(err));
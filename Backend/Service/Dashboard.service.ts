import { AppDataSource } from "../config/data-source";
import { Property } from "../Entity/Property";
import { LeaseAgreement } from "../Entity/LeaseAgreement";
import { Rentalagreement } from "../Entity/Rentalagreement";
import { Vendor } from "../Entity/Vendor";
import { LeaseCancellation } from "../Entity/LeaseCancellation";

export const getDashboardData = async () => {
  const propRepo = AppDataSource.getRepository(Property);
  const leaseRepo = AppDataSource.getRepository(LeaseAgreement);
  const rentalRepo = AppDataSource.getRepository(Rentalagreement);
  const vendorRepo = AppDataSource.getRepository(Vendor);
  const lcRepo = AppDataSource.getRepository(LeaseCancellation);

  const propertiesCount = await propRepo.count();
  // occupied properties: status = 'OCCUPIED' or occupancy indicates leased/rented
  const occupiedCount = await propRepo.createQueryBuilder("p")
    .where("p.status = :occ", { occ: "OCCUPIED" })
    .orWhere("p.occupancy IN (:...vals)", { vals: ["Leased", "Rented"] })
    .getCount();

  const [activeLeasesCount, activeRentalsCount, vendorsCount, cancellationsCount] = await Promise.all([
    leaseRepo.count({ where: { status: "Active" } }),
    rentalRepo.count({ where: { status: "Active" } }),
    vendorRepo.count(),
    lcRepo.count(),
  ]);

  // recent leases (limit 5)
  const recentLeasesRaw = await leaseRepo.find({ where: { status: "Active" }, order: { createdAt: "DESC" }, take: 5 });
  const recentLeases = recentLeasesRaw.map(l => ({
    id: l.leaseId || `LSE-${String(l.id).padStart(3, "0")}`,
    tenant: l.customerName || l.tenant || "",
    property: l.propertyAddress || l.property || "",
    monthlyRent: l.monthlyRent || 0,
    start: l.startDate || null,
    end: l.endDate || null,
    status: l.status || "",
  }));

  return {
    stats: {
      properties: propertiesCount,
      occupiedProperties: occupiedCount,
      activeLeases: activeLeasesCount,
      activeRentals: activeRentalsCount,
      openMaintenance: 0,
      activeVendors: vendorsCount,
      cancellations: cancellationsCount,
      outstandingAmount: 0,
    },
    recentLeases,
    recentMaintenance: [],
  };
};

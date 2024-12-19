import React from "react";
import { Route, Routes } from "react-router-dom";
import ParcelTransferEfficiency from "../pages/operationsHead/ParcelTransferEfficiency";
import ParcelDeliveryEfficiency from "../pages/operationsHead/ParcelDeliveryEfficiency";
import ParcelConditionAnalysis from "../pages/operationsHead/ParcelConditionAnalysis";
import CustomerSatisfaction from "../pages/operationsHead/CustomerSatisfaction";

const StrategicInsights = () => {
  return (
    <Routes>
      <Route path="parcel-transfer-efficiency" element={<ParcelTransferEfficiency />} />
      <Route path="parcel-delivery-efficiency" element={<ParcelDeliveryEfficiency />} />
      <Route path="parcel-condition-analysis" element={<ParcelConditionAnalysis />} />
      <Route path="customer-satisfaction" element={<CustomerSatisfaction />} />
    </Routes>
  );
};

export default StrategicInsights;

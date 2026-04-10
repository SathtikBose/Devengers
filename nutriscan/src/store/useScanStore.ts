import { create } from "zustand";

type ScanState = {
  product: any;
  analysis: any;

  setScanResult: (data: any) => void;
  clearScan: () => void;
};

/**
 * 📦 Scan Store
 * Stores last scanned product + analysis
 */
export const useScanStore = create<ScanState>((set) => ({
  product: null,
  analysis: null,

  /**
   * Save scan result
   */
  setScanResult: (data) =>
    set({
      product: data.product,
      analysis: data.analysis,
    }),

  /**
   * Clear scan data
   */
  clearScan: () =>
    set({
      product: null,
      analysis: null,
    }),
}));

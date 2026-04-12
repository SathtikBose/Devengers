import { create } from "zustand";

type ScanResultPayload = {
  product: any;
  analysis: any;
};

type ScanState = ScanResultPayload & {
  /** When set, Analysis tab loads this scan from the API then clears. */
  pendingAnalysisScanId: string | null;

  setScanResult: (data: ScanResultPayload) => void;
  setPendingAnalysisScanId: (id: string | null) => void;
  applyFetchedScan: (scanDoc: { result?: any; barcode?: string; image?: string }) => void;
  clearScanResult: () => void;
};

export const useScanStore = create<ScanState>((set) => ({
  product: null,
  analysis: null,
  pendingAnalysisScanId: null,

  setScanResult: (data) =>
    set({
      product: data.product,
      analysis: data.analysis,
    }),

  setPendingAnalysisScanId: (id) => set({ pendingAnalysisScanId: id }),

  applyFetchedScan: (scanDoc) => {
    const result = scanDoc.result || {};
    const product =
      result.product ||
      (scanDoc.barcode
        ? {
            name: `Barcode ${scanDoc.barcode}`,
            subtitle: "",
            image: scanDoc.image || "",
          }
        : { name: "Scanned product", subtitle: "", image: scanDoc.image || "" });
    const analysis = result.analysis || {};
    set({ product, analysis });
  },

  clearScanResult: () =>
    set({
      product: null,
      analysis: null,
    }),
}));

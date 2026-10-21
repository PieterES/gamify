"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CertId } from "@/types/question";
import { CertConfig, DEFAULT_CERT, getCert, isCertId } from "@/lib/certifications";

const STORAGE_KEY = "gamify.activeCert";

interface CertContextValue {
  certId: CertId;
  cert: CertConfig;
  setCertId: (id: CertId) => void;
}

const CertContext = createContext<CertContextValue | null>(null);

export function CertProvider({ children }: { children: React.ReactNode }) {
  const [certId, setCertIdState] = useState<CertId>(DEFAULT_CERT);

  // Restore the last chosen certificate (per browser)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isCertId(saved)) setCertIdState(saved);
    } catch {
      // storage unavailable: keep default
    }
  }, []);

  function setCertId(id: CertId) {
    setCertIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }

  return (
    <CertContext.Provider value={{ certId, cert: getCert(certId), setCertId }}>
      {children}
    </CertContext.Provider>
  );
}

export function useCert(): CertContextValue {
  const ctx = useContext(CertContext);
  if (!ctx) throw new Error("useCert must be used inside CertProvider");
  return ctx;
}

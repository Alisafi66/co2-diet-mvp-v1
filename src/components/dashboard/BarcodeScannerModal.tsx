"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Food } from "@/types/food";
import { getProductByBarcode } from "@/lib/food/openFoodFacts";

interface BarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onFound: (food: Food) => void;
}

type ScanStatus = "idle" | "scanning" | "looking-up" | "not-found" | "error";

export function BarcodeScannerModal({
  open,
  onClose,
  onFound,
}: BarcodeScannerModalProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setStatus("scanning");
    setErrorMessage("");

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    async function start() {
      try {
        if (!videoRef.current) return;

        const controls = await reader.decodeFromVideoDevice(
          undefined, // use default camera
          videoRef.current,
          async (result, err) => {
            if (cancelled) return;
            if (result) {
              const barcode = result.getText();
              controls.stop();
              setStatus("looking-up");

              const food = await getProductByBarcode(barcode);
              if (cancelled) return;

              if (food) {
                onFound(food);
                onClose();
              } else {
                setStatus("not-found");
              }
            }
          },
        );

        controlsRef.current = controls;
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(
          "Camera access was denied or is unavailable. You can still search or add this item manually.",
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [open, onClose, onFound]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Scan barcode
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Point your camera at a product barcode.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl bg-black">
          <video
            ref={videoRef}
            className="aspect-square w-full object-cover"
            muted
            playsInline
          />
        </div>

        <div className="mt-3 min-h-6 text-sm">
          {status === "scanning" && (
            <p className="text-[var(--rcn-muted)]">Scanning…</p>
          )}
          {status === "looking-up" && (
            <p className="text-[var(--rcn-muted)]">Found a barcode, looking it up…</p>
          )}
          {status === "not-found" && (
            <p className="text-amber-600">
              No product found for that barcode. Try again or add it manually.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600">{errorMessage}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 min-h-12 w-full rounded-xl border border-[var(--rcn-border)] text-sm font-medium text-[var(--rcn-muted)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
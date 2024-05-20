"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Component() {
  const [printMode, setPrintMode] = useState(false);
  const [photos, setPhotos] = useState<Array<string | null>>(
    Array(8).fill(null)
  );
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos]; // create a copy of the array
        Array.from(e.target.files!).forEach((file) => {
          const nullIndex = newPhotos.indexOf(null);
          if (nullIndex !== -1) {
            newPhotos[nullIndex] = URL.createObjectURL(file);
          } else {
            newPhotos.push(URL.createObjectURL(file));
          }
        });
        return newPhotos; // return the new array
      });
    }
  };

  useEffect(() => {
    if (printMode) {
      window.print();
      setPrintMode(false);
    }
  }, [printMode]);

  return (
    <main
      className={
        printMode
          ? "m-[3mm]"
          : "flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8"
      }
    >
      {!printMode ? (
        <div className="max-w-4xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Polaroid Gallery
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload and view your images in a polaroid-style grid.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <label
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md cursor-pointer transition-colors"
                  htmlFor="upload"
                >
                  <UploadIcon className="mr-2 h-5 w-5" />
                  Upload
                </label>
                <input
                  accept="image/*"
                  className="hidden"
                  id="upload"
                  multiple
                  type="file"
                  onChange={handleUpload}
                />
                <Button
                  className="flex items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  variant="outline"
                  onClick={() => {
                    setPrintMode(true);
                  }}
                >
                  <PrinterIcon className="mr-2 h-5 w-5" />
                  Print
                </Button>
              </div>
            </div>
            <div id="photo-gallery">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((p, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden border px-2 pt-2 pb-12"
                  >
                    <Image
                      alt="Polaroid Image"
                      className="w-full h-auto object-cover transition-transform duration-300 rounded-lg"
                      height={400}
                      src={p ?? "/placeholder.svg"}
                      style={{
                        aspectRatio: "8.8/10.7",
                        objectFit: "cover",
                      }}
                      width={300}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* <div id="edit-button" className="flex justify-center mb-5">
            <Button
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 hover:text-white text-white font-medium rounded-md cursor-pointer transition-colors"
              variant="outline"
              onClick={() => {
                setPrintMode(false);
              }}
            >
              <DeleteIcon className="mr-2 h-5 w-5" />
              Edit
            </Button>
          </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((p, i) => (
              <div
                key={i}
                className="relative group overflow-hidden border px-2 pt-2 pb-12"
              >
                <Image
                  alt="Polaroid Image"
                  className="w-full h-auto object-cover transition-transform duration-300 rounded-lg"
                  height={400}
                  src={p ?? "/placeholder.svg"}
                  style={{
                    aspectRatio: "8.8/10.7",
                    objectFit: "cover",
                  }}
                  width={300}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function PrinterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function DeleteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <line x1="18" x2="12" y1="9" y2="15" />
      <line x1="12" x2="18" y1="9" y2="15" />
    </svg>
  );
}

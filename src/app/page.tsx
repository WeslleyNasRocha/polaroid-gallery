"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import getCroppedImg from "@/lib/cropImage";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge";
import {
  DeleteIcon,
  ExcludeIcon,
  FilePenIcon,
  PrinterIcon,
  ReplaceIcon,
  UploadIcon,
} from "./icons";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Component() {
  const [printMode, setPrintMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState<null | number>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [photos, setPhotos] = useState<Array<string | null>>(
    Array(8).fill(null)
  );
  const [replaceId, setReplaceId] = useState<number | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.name === "upload_single" && replaceId !== null) {
        setPhotos((prevPhotos) => {
          const newPhotos = [...prevPhotos];
          newPhotos[replaceId] = URL.createObjectURL(e.target.files![0]);
          return newPhotos;
        });
        setReplaceId(null);
        return;
      }
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
    if (photos.length % 8 !== 0) {
      setPhotos((prevPhotos) => {
        const newPhotos = [...prevPhotos];
        for (let i = 0; i < 8 - (photos.length % 8); i++) {
          newPhotos.push(null);
        }
        return newPhotos;
      });
    }
  }, [photos]);

  return (
    <main
      className={
        printMode
          ? "min-w-screen min-h-screen"
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
                  name="upload"
                  multiple
                  type="file"
                  onChange={handleUpload}
                />
                <input
                  accept="image/*"
                  className="hidden"
                  name="upload_single"
                  id="upload_single"
                  type="file"
                  onChange={handleUpload}
                  onAbort={() => {
                    setReplaceId(null);
                  }}
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
                  <>
                    {i % 8 === 0 && i !== 0 && (
                      <>
                        <hr className="col-span-full border-dashed mt-4" />
                      </>
                    )}
                    {i % 8 === 0 && (
                      <>
                        <div className="col-span-full text-end text-xs font-light">
                          Page {Math.floor(i / 8) + 1}
                        </div>
                      </>
                    )}
                    <div
                      key={i}
                      className="relative group overflow-hidden border border-slate-200 px-2 pt-2 pb-12 hover:"
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
                      <div className="absolute hidden gap-2 group-hover:flex bottom-2 right-2">
                        <Button
                          className={twMerge(
                            "p-1 h-7 w-7 bg-red-300 hover:bg-red-400 text-gray-100 transition-colors",
                            p ? "visible" : "invisible"
                          )}
                          title="Delete Image"
                          onClick={() => {
                            setPhotos((prevPhotos) => {
                              const newPhotos = [...prevPhotos];
                              newPhotos[i] = null;
                              return newPhotos;
                            });
                          }}
                        >
                          <ExcludeIcon className="h-5 w-5" />
                        </Button>
                        <Button
                          className={twMerge(
                            "p-1 h-7 w-7 bg-green-300 hover:bg-green-400 text-gray-100 transition-colors",
                            p ? "visible" : "invisible"
                          )}
                          title="Edit Image"
                          onClick={() => {
                            setShowEditModal(i);
                          }}
                        >
                          <FilePenIcon className="h-5 w-5" />
                        </Button>
                        <Button
                          className="p-1 h-7 w-7 bg-blue-300 hover:bg-blue-400 text-gray-100 transition-colors"
                          title="Replace Image"
                          onClick={() => {
                            setReplaceId(i);
                            document.getElementById("upload_single")?.click();
                          }}
                        >
                          <ReplaceIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="print:hidden flex justify-center my-4 gap-2">
            <Button
              className="flex items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              variant="outline"
              onClick={() => setPrintMode(false)}
            >
              <DeleteIcon className="mr-2 h-5 w-5" />
              Go Back
            </Button>
            <Button
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md cursor-pointer transition-colors"
              onClick={() => window.print()}
            >
              <PrinterIcon className="mr-2 h-5 w-5" />
              Print
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {photos.map((p, i) =>
              p ? (
                <div
                  key={i}
                  className="relative group overflow-hidden border border-slate-200 px-2 pt-2 pb-12"
                >
                  <Image
                    alt="Polaroid Image"
                    className="w-full h-auto object-cover transition-transform duration-300 rounded-lg"
                    height={400}
                    src={p}
                    style={{
                      aspectRatio: "8.8/10.7",
                      objectFit: "cover",
                    }}
                    width={300}
                  />
                </div>
              ) : null
            )}
          </div>
        </>
      )}
      <Dialog
        open={showEditModal !== null}
        onOpenChange={(o) => {
          if (!o) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setShowEditModal(null);
          }
        }}
      >
        <DialogContent
          style={{ minHeight: "60vh" }}
          className="flex flex-col pt-10"
        >
          <div className="relative flex-1">
            <Cropper
              image={photos[showEditModal!]!}
              crop={crop}
              zoom={zoom}
              zoomSpeed={0.1}
              aspect={8.8 / 10.7}
              onCropChange={setCrop}
              onCropComplete={async (croppedArea, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
              onZoomChange={setZoom}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                const croppedImage = await getCroppedImg(
                  photos[showEditModal!]!,
                  croppedAreaPixels!
                );
                setPhotos((prevPhotos) => {
                  const newPhotos = [...prevPhotos];
                  newPhotos[showEditModal!] = croppedImage;
                  return newPhotos;
                });
                setShowEditModal(null);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCroppedAreaPixels(null);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

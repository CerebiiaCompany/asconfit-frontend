import React, { useState } from "react";

interface ReportPdfUploadProps {
    pdfFile: File | null;
    pdfUrl: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent) => void;
    onClear: () => void;
}

export const ReportPdfUpload: React.FC<ReportPdfUploadProps> = ({
    pdfFile,
    pdfUrl,
    fileInputRef,
    onFileChange,
    onDrop,
    onClear,
}) => {
    const [dragging, setDragging] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-semibold text-base">Informe PDF</h2>
                    <p className="text-gray-300 text-xs mt-0.5">Sube el informe preliminar en PDF</p>
                </div>
                {pdfFile && (
                    <button
                        onClick={onClear}
                        className="text-xs text-gray-300 hover:text-white border border-gray-500 hover:border-gray-300 px-3 py-1 rounded-lg transition-colors"
                    >
                        Cambiar archivo
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col p-4">
                {!pdfUrl ? (
                    /* Drop zone */
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={e => { setDragging(false); onDrop(e); }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors min-h-[400px] ${dragging ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/40"
                            }`}
                    >
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">Arrastra el PDF aquí</p>
                        <p className="text-xs text-gray-400 mt-1">o haz click para seleccionar</p>
                        <button
                            type="button"
                            className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Seleccionar PDF
                        </button>
                    </div>
                ) : (
                    /* PDF preview */
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center gap-2 px-1">
                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                            </svg>
                            <span className="text-sm text-gray-700 font-medium truncate">{pdfFile?.name}</span>
                            <span className="text-xs text-gray-400 shrink-0">
                                {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
                            </span>
                        </div>
                        <iframe
                            src={pdfUrl}
                            title="Vista previa del informe"
                            className="flex-1 w-full rounded-lg border border-gray-200"
                            style={{ minHeight: "500px" }}
                        />
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

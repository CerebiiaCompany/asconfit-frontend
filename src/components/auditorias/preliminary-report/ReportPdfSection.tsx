import React, { useEffect, useRef, useState } from "react";
import { auditoriaService } from "../../../services/auditoriaService";
import { storageUrl } from "../../../utils/storageUrl";
import { ReportPdfUpload } from "./ReportPdfUpload";

interface ReportPdfSectionProps {
    auditoriaId: string;
}

export const ReportPdfSection: React.FC<ReportPdfSectionProps> = ({ auditoriaId }) => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        auditoriaService.getInformePreliminar(auditoriaId).then((data) => {
            if (data.path) setPdfUrl(storageUrl(data.path));
        }).catch(() => { });
    }, [auditoriaId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== "application/pdf") return;
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
        setUploadSuccess(false);
        setUploadError(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || file.type !== "application/pdf") return;
        setPdfFile(file);
        setPdfUrl(URL.createObjectURL(file));
        setUploadSuccess(false);
        setUploadError(null);
    };

    const handleUpload = async () => {
        if (!pdfFile) return;
        setUploading(true);
        setUploadError(null);
        try {
            const { path } = await auditoriaService.uploadInformePreliminar(auditoriaId, pdfFile);
            setPdfUrl(storageUrl(path));
            setPdfFile(null);
            setUploadSuccess(true);
        } catch {
            setUploadError("Error al subir el informe. Intenta de nuevo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <ReportPdfUpload
            pdfFile={pdfFile}
            pdfUrl={pdfUrl}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onClear={() => { setPdfFile(null); setPdfUrl(null); setUploadSuccess(false); }}
            onUpload={handleUpload}
            uploading={uploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            isSaved={!pdfFile && !!pdfUrl}
        />
    );
};

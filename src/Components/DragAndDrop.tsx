import React, {useState} from 'react';
import {__} from '@wordpress/i18n';
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
import {toast} from "react-toastify";
import * as XLSX from 'xlsx';
import {applyFilters} from "../Helpers/Hooks";

interface DragAndDropComponentProps {
    setFileData: (fileData: any) => void;
}

function DragAndDrop({setFileData, ...props}: DragAndDropComponentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isCSVorExcelFile = (file: File) => {
        return file.type === 'text/csv' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    };
    const parseCSV = (csvString: string) => {
        const lines = csvString.split('\n');
        return lines.map((line) => line.split(','));
    };

    const parseExcel = (arrayBuffer: ArrayBuffer) => {
        // Parse Excel data using xlsx
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    };
    const handleFileUpload = (files: FileList | null) => {
        if (files && files.length > 0 && isCSVorExcelFile(files[0])) {
            setIsLoading(true);

            const reader = new FileReader();

            reader.onload = (event) => {
                const fileContent = event.target?.result; // Get the content of the file
                if (fileContent) {
                    // Parse the file content if it's a CSV or Excel file
                    if (files[0].type === 'text/csv') {
                        const csvData = parseCSV(fileContent as string);
                        setFileData(csvData); // Set the parsed CSV data
                    } else if (files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        const excelData = parseExcel(fileContent as ArrayBuffer);
                        setFileData(excelData); // Set the parsed Excel data
                    }
                }

                // Simulating a file upload process
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 1;
                    setUploadProgress(progress);
                    if (progress >= 100) {
                        clearInterval(interval);
                        setIsLoading(false);
                        setUploadProgress(0);
                        // Handle the uploaded file here
                    }
                }, 20);
            };

            // Read the file as text content or ArrayBuffer
            if (files[0].type === 'text/csv') {
                reader.readAsText(files[0]);
            } else if (files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                reader.readAsArrayBuffer(files[0]);
            }
        } else {
            toast.error(__('Please upload a CSV or Excel file only', 'pcm'));
        }
    };


    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFileUpload(files);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const progressBarStyle = {
        width: `${uploadProgress}%`,
        background: `linear-gradient(to right, #4299e1 ${uploadProgress}%, transparent ${uploadProgress}%)`,
    };

    const dropZoneStyleColor = applyFilters('pcm.dropZoneStyleColor', 'rgba(145,144,144,0.3)')
    const dropZoneStyle = {
        background: isLoading ? `linear-gradient(to right, ${dropZoneStyleColor} ${uploadProgress}%, transparent ${uploadProgress}%)` : '',
    };

    return (
        <>
            <label htmlFor="dropzone-file">
                <div className="flex items-center justify-center w-full">
                    <div
                        style={dropZoneStyle}
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div>
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center w-full">
                                    <p className="mt-2 text-sm text-gray-500">{uploadProgress}% {__('Analyzing file', 'pcm')}</p>
                                </div>
                                ) : (
                                <>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <CloudArrowUpIcon className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">{__('Click to upload', 'pcm')}</span> {__('or drag and drop file here', 'pcm')}
                                        </p>
                                        <p className="text-xs text-gray-500">{__('CSV and Excel files only', 'pcm')}</p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => handleFileUpload(event.target.files)}
                                        disabled={isLoading}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/*{isLoading && (*/}
                {/*    <div className="flex flex-col items-center justify-center w-full">*/}
                {/*    <div className="w-full bg-blue-100 h-2 rounded-md">*/}
                {/*        <div style={progressBarStyle} className="h-2 rounded-md" />*/}
                {/*    </div>*/}
                {/*    <p className="mt-2 text-xs text-gray-500">{uploadProgress}% {__('Uploaded', 'pcm')}</p>*/}
                {/*</div>*/}
                {/*)}*/}
            </label>
        </>
    );
}

// @ts-ignore
window.DragAndDrop = DragAndDrop;
export default DragAndDrop;

import React, { useState, useEffect } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Função para carregar dinamicamente os ficheiros PDF da pasta public/pdf/
function getPdfFiles() {
  try {
    // require.context may fail when trying to read from `public/` depending on the bundler.
    // Wrap in try/catch and return an empty list if it isn't available.
    const context = require.context('../../public/pdf/v0', false, /\.pdf$/);
    return context.keys().map((key) => key.replace('./', ''));
  } catch (e) {
    // Fallback: no bundled list available. Return empty array so the component still renders.
    return [];
  }
}

const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [leftSelectedFile, setLeftSelectedFile] = useState('eng_10-09_killteam_team_rules_deathwatch-nsq5bndvac-cystuwbu4l.pdf');
  const [rightSelectedFile, setRightSelectedFile] = useState('eng_10-09_killteam_team_rules_deathwatch-nsq5bndvac-cystuwbu4l.pdf');
  const [pdfFiles, setPdfFiles] = useState([]);

  // Carrega os ficheiros PDF ao montar o componente
  useEffect(() => {
    setPdfFiles(getPdfFiles());
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 center">PDF Viewer</h1>
      <div className="mb-4 flex space-x-4">
        <div className="w-1/3">
          <select
            className="p-2 border rounded"
            value={leftSelectedFile}
            onChange={(e) => setLeftSelectedFile(e.target.value)}
          >
            {pdfFiles.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <select
            className="p-2 border rounded"
            value={rightSelectedFile}
            onChange={(e) => setRightSelectedFile(e.target.value)}
          >
            {pdfFiles.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ height: '40vh', width:'40vv', overflow: 'auto' ,alignItems: 'initial' }}>
        <Worker workerUrl="/pdf.worker.min.js">
          <div className="flex space-x-4 h-full">
            <div className="w-1/2">
              <Viewer
                // PDFs are served from public/pdf/v0 — include the v0 folder in the URL so
                // the viewer fetches the real binary file instead of an HTML page.
                fileUrl={`/pdf/v0/${leftSelectedFile}`}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </div>
        </Worker>
      </div>
      <div style={{ height: '40vh', width:'40vv', overflow: 'auto' ,alignItems: 'end' }}>
        <Worker workerUrl="/pdf.worker.min.js">
          <div className="flex space-x-4 h-full">
            <div className="w-1/2">
              <Viewer
                fileUrl={`/pdf/v0/${rightSelectedFile}`}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </div>
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;
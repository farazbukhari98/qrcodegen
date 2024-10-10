import React, { useState, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useDropzone } from 'react-dropzone'
import { Link, Upload, File } from 'lucide-react'

function App() {
  const [qrType, setQrType] = useState<'link' | 'document'>('link')
  const [qrValue, setQrValue] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [logoMode, setLogoMode] = useState<'icon' | 'background'>('icon')
  const [opacity, setOpacity] = useState(0.3)
  const [document, setDocument] = useState<File | null>(null)
  const [qrColor, setQrColor] = useState('#000000')

  const onLogoDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogo(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const onDocumentDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setDocument(file)
    // In a real application, you would upload the file to a server and generate a shareable link
    setQrValue(`https://example.com/shared-document/${file.name}`)
  }, [])

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({ onDrop: onLogoDrop, accept: { 'image/*': [] } })
  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps, isDragActive: isDocumentDragActive } = useDropzone({ onDrop: onDocumentDrop })

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">QR Code Generator</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to attach to the QR code?
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setQrType('link')}
              className={`flex-1 px-4 py-2 rounded-md ${qrType === 'link' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Link/Text
            </button>
            <button
              onClick={() => setQrType('document')}
              className={`flex-1 px-4 py-2 rounded-md ${qrType === 'document' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Document
            </button>
          </div>
        </div>

        {qrType === 'link' && (
          <div className="mb-4">
            <label htmlFor="qrInput" className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL or text for QR code
            </label>
            <div className="relative">
              <input
                id="qrInput"
                type="text"
                value={qrValue}
                onChange={(e) => setQrValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
              <Link className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        )}

        {qrType === 'document' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document to Share
            </label>
            <div {...getDocumentRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input {...getDocumentInputProps()} />
              {isDocumentDragActive ? (
                <p className="text-blue-500">Drop the document here ...</p>
              ) : (
                <div className="flex flex-col items-center">
                  <File className="text-gray-400 mb-2" size={24} />
                  <p className="text-gray-500">Drag & drop a document here, or click to select</p>
                </div>
              )}
            </div>
            {document && (
              <p className="mt-2 text-sm text-gray-600">Document: {document.name}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo (optional)
          </label>
          <div {...getLogoRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <input {...getLogoInputProps()} />
            {isLogoDragActive ? (
              <p className="text-blue-500">Drop the logo here ...</p>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400 mb-2" size={24} />
                <p className="text-gray-500">Drag & drop a logo here, or click to select</p>
              </div>
            )}
          </div>
        </div>

        {logo && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Mode
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setLogoMode('icon')}
                  className={`px-4 py-2 rounded-md ${logoMode === 'icon' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Icon
                </button>
                <button
                  onClick={() => setLogoMode('background')}
                  className={`px-4 py-2 rounded-md ${logoMode === 'background' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Background
                </button>
              </div>
            </div>

            {logoMode === 'background' && (
              <div className="mb-4">
                <label htmlFor="opacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Background Opacity: {opacity}
                </label>
                <input
                  id="opacity"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}

        <div className="mb-4">
          <label htmlFor="qrColor" className="block text-sm font-medium text-gray-700 mb-2">
            QR Code Color
          </label>
          <input
            id="qrColor"
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            className="w-full h-10 p-1 rounded-md cursor-pointer"
          />
        </div>

        <div className="mt-6 flex justify-center">
          {qrValue && (
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              {logoMode === 'background' && logo && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${logo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: opacity,
                  }}
                />
              )}
              <QRCodeSVG
                value={qrValue}
                size={200}
                level="H"
                imageSettings={logo && logoMode === 'icon' ? {
                  src: logo,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                } : undefined}
                bgColor="transparent"
                fgColor={qrColor}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
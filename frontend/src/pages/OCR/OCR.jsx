import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { FileText, Image, Upload, AlertCircle, Copy, Check, FileType2, RefreshCw, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const OCRScanner = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  
  const { toast } = useToast();

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      setFile(null);
      setFilePreview(null);
      return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    
    // Some browsers might use different MIME types, so we also check extensions
    const fileName = selectedFile.name.toLowerCase();
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
      setError('Please upload a PDF or image file (PNG, JPG, JPEG).');
      setFile(null);
      setFilePreview(null);
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create a preview for images
    if (selectedFile.type.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, just show an icon or placeholder
      setFilePreview(null);
    }
  };

  // Process the file with the OCR backend
  const processFile = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
        // No need to set Content-Type header - browser will set it with boundary for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.text) {
        setExtractedText(data.text);
        setActiveTab('results'); // Switch to results tab when processing is complete
        toast({
          title: "Text extracted successfully",
          description: "Your document has been processed.",
        });
      } else {
        throw new Error('No text extracted from the document');
      }
    } catch (err) {
      console.error('OCR Processing Error:', err);
      setError(err.message || 'An error occurred while processing the file.');
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: err.message || "An error occurred while processing the file.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy extracted text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied to clipboard",
          description: "Text has been copied to your clipboard.",
          duration: 3000,
        });
      },
      (err) => {
        console.error('Copy failed:', err);
        setError('Failed to copy text to clipboard');
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy text to clipboard.",
          duration: 3000,
        });
      }
    );
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setExtractedText('');
    setError(null);
    setActiveTab('upload');
  };

  // Save text as file
  const saveAsTextFile = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File saved",
      description: "Extracted text has been saved as a file.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">OCR Document Scanner</h1>
          <p className="mt-2 text-lg text-slate-600">
            Extract text from PDFs and images using Optical Character Recognition
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="results" disabled={!extractedText}>Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Upload a PDF or image file to extract text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* File upload area with drag and drop */}
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => document.getElementById('file-upload').click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add('ring-2', 'ring-primary', 'ring-inset');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-inset');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-inset');
                      
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        // Create a synthetic event with the dropped file
                        const fileList = e.dataTransfer.files;
                        const event = { target: { files: fileList } };
                        handleFileChange(event);
                      }
                    }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="space-y-4">
                        {filePreview ? (
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="max-h-48 mx-auto object-contain rounded" 
                          />
                        ) : (
                          <FileText className="h-16 w-16 text-red-500 mx-auto" />
                        )}
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-upload').click();
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium">Click to upload or drag and drop</p>
                          <p className="text-sm text-slate-500">PDF, PNG, JPG, JPEG (max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Process button */}
                  <Button 
                    onClick={processFile} 
                    disabled={!file || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Extract Text'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>
                  Text extracted from your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Extracted text display */}
                  <div className="relative">
                    <Textarea
                      value={extractedText}
                      readOnly
                      className="min-h-72 font-mono text-sm p-4"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Word and character count */}
                  <div className="text-sm text-slate-500 flex space-x-4">
                    <div>
                      <span className="font-medium">Words:</span>{' '}
                      {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0}
                    </div>
                    <div>
                      <span className="font-medium">Characters:</span>{' '}
                      {extractedText.length}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Process Another Document
                </Button>
                <Button 
                  onClick={saveAsTextFile}
                >
                  <FileType2 className="h-4 w-4 mr-2" />
                  Save as Text File
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading progress */}
        {isLoading && (
          <div className="mt-4">
            <p className="text-sm text-slate-600 mb-2">Processing your document...</p>
            <Progress value={null} className="h-1" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Powered by Flask, Tesseract OCR, and React</p>
      </footer>
    </div>
  );
};

export default OCRScanner;
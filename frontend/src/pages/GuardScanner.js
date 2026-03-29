import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { ShieldCheck, LogOut, ScanLine, CheckCircle, XCircle, RefreshCw, Camera, CameraOff, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function GuardScanner() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guardData, setGuardData] = useState(null);
  const [autoRefreshCountdown, setAutoRefreshCountdown] = useState(0);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);
  const webcamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const lastScannedRef = useRef('');

  useEffect(() => {
    if (autoRefreshCountdown <= 0) return;
    const timer = setTimeout(() => setAutoRefreshCountdown(autoRefreshCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [autoRefreshCountdown]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Check for browser environment
    const data = localStorage.getItem('guard_data');
    if (!data) { navigate('/guard/login'); return; }
    setGuardData(JSON.parse(data));
  }, [navigate]);

  // Start camera scanning
  useEffect(() => {
    if (scanMode === 'camera' && cameraActive && !validationResult) {
      startQRScan();
    } else {
      stopQRScan();
    }
    return () => stopQRScan();
  }, [scanMode, cameraActive, validationResult]);

  const startQRScan = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setScanning(true);
    scanIntervalRef.current = setInterval(() => {
      captureAndScan();
    }, 500);
  };

  const stopQRScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
  };

  const captureAndScan = useCallback(async () => {
    if (!webcamRef.current || loading) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      // Try jsQR first (more reliable)
      try {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
          setTimeout(rej, 5000); // 5s timeout
        });
        
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { 
          inversionAttempts: 'dontInvert' 
        });
        
        if (code && code.data && code.data !== lastScannedRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ QR detected via jsQR:', code.data);
          }
          lastScannedRef.current = code.data;
          stopQRScan();
          await validateToken(code.data);
          return;
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('jsQR scan attempt failed:', err.message);
        }
      }

      // Fallback to BarcodeDetector (Chrome 83+)
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = imageSrc;
          
          await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
            setTimeout(rej, 5000);
          });
          
          const bitmap = await createImageBitmap(img);
          const barcodes = await barcodeDetector.detect(bitmap);
          bitmap.close();
          
          if (barcodes.length > 0) {
            const qrValue = barcodes[0].rawValue;
            if (qrValue && qrValue !== lastScannedRef.current) {
              if (process.env.NODE_ENV === 'development') {
                console.log('✅ QR detected via BarcodeDetector:', qrValue);
              }
              lastScannedRef.current = qrValue;
              stopQRScan();
              await validateToken(qrValue);
              return;
            }
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.log('BarcodeDetector scan attempt failed:', err.message);
          }
        }
      }
    } catch (err) {
      console.error('Scan error:', err);
    }
  }, [loading]);

  const validateToken = async (tokenValue) => {
    if (!tokenValue.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Empty token');
      }
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Validating token:', tokenValue);
    }
    setLoading(true);
    setValidationResult(null);
    
    try {
      const fullUrl = `${BACKEND_URL}/api/validate-qr`;
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 API call to:', fullUrl);
      }
      
      const response = await axios.post(fullUrl, { token: tokenValue.trim() });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Validation response:', response.data);
      }
      
      setValidationResult(response.data);
      setAutoRefreshCountdown(2);
      toast.success(response.data.valid ? 'Access Granted!' : 'Access Denied');
      
      setTimeout(() => {
        setValidationResult(null);
        setToken('');
        lastScannedRef.current = '';
        setAutoRefreshCountdown(0);
        if (scanMode === 'camera' && cameraActive) startQRScan();
        else inputRef.current?.focus();
      }, 2000);
    } catch (error) {
      console.error('❌ Validation error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.detail || error.message || 'Validation failed';
      setValidationResult({ valid: false, reason: errorMessage });
      toast.error(`❌ ${errorMessage}`);
      setAutoRefreshCountdown(2);
      
      setTimeout(() => {
        setValidationResult(null);
        setToken('');
        lastScannedRef.current = '';
        setAutoRefreshCountdown(0);
        if (scanMode === 'camera' && cameraActive) startQRScan();
        else inputRef.current?.focus();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleManualValidate = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    await validateToken(token);
  };

  const handleManualRefresh = () => {
    setValidationResult(null);
    setToken('');
    lastScannedRef.current = '';
    setAutoRefreshCountdown(0);
    if (scanMode === 'manual') inputRef.current?.focus();
    else if (cameraActive) startQRScan();
  };

  // Request camera permission using native browser API
  const requestCameraPermission = async () => {
    try {
      // First, check if permissions API is available
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });
        
        if (permissionStatus.state === 'denied') {
          setCameraError('Camera permission is blocked. Please enable camera in browser settings and refresh the page.');
          setCameraActive(false);
          return false;
        }
      }

      // Request camera access - this will show native browser dialog
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // Stop the stream - Webcam component will handle the actual stream
      stream.getTracks().forEach(track => track.stop());
      
      setCameraActive(true);
      setCameraError(null);
      lastScannedRef.current = '';
      toast.success('Camera permission granted!');
      return true;
    } catch (err) {
      let errorMessage = 'Could not access camera';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = '❌ Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = '❌ No camera device found. Connect a camera and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = '❌ Camera is already in use by another app. Close other apps and try again.';
      } else if (err.name === 'SecurityError') {
        errorMessage = '❌ Camera access blocked by security settings. Use HTTPS or localhost.';
      }
      
      setCameraError(errorMessage);
      setCameraActive(false);
      toast.error(errorMessage);
      return false;
    }
  };

  const handleCameraStart = async () => {
    // Request permission first
    const permitted = await requestCameraPermission();
    if (!permitted) {
      // Permission denied or error - stay on manual mode
      toast.error('Switch to Manual Entry mode to scan QR codes');
    }
  };

  const handleCameraError = (err) => {
    let errorMessage = 'Camera error: ';
    if (err.name === 'NotAllowedError') {
      errorMessage += 'Camera access was denied. Please check browser permissions.';
    } else if (err.name === 'NotFoundError') {
      errorMessage += 'No camera found on this device.';
    } else {
      errorMessage += 'Unable to access camera.';
    }
    setCameraError(errorMessage);
    setCameraActive(false);
    toast.error('Camera access failed');
  };

  const handleLogout = () => {
    stopQRScan();
    localStorage.removeItem('guard_data');
    navigate('/guard/login');
  };

  if (!guardData) return null;

  // Full screen result
  if (validationResult) {
    const isValid = validationResult.valid;
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${isValid ? 'bg-emerald-500' : 'bg-red-500'}`} data-testid="validation-result">
        <div className="text-center text-white max-w-lg w-full">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${isValid ? 'bg-white/20 border-4 border-white' : 'bg-white/20 border-4 border-white'}`}>
            {isValid ? <CheckCircle className="w-16 h-16 text-white" /> : <XCircle className="w-16 h-16 text-white" />}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
            {isValid ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
          </h1>

          {isValid && validationResult.person && (
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 mb-6 text-left space-y-2">
              <p className="text-white/80 text-xs uppercase tracking-widest font-bold mb-3 text-center">Visitor Details</p>
              {validationResult.person.name && (
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Name</span>
                  <span className="text-white font-bold">{validationResult.person.name}</span>
                </div>
              )}
              {validationResult.type && (
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Type</span>
                  <span className="text-white font-bold capitalize">{validationResult.type}</span>
                </div>
              )}
              {validationResult.person.valid_till && (
                <div className="flex justify-between">
                  <span className="text-white/70 text-sm">Valid Till</span>
                  <span className="text-white font-bold">{new Date(validationResult.person.valid_till).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {!isValid && (
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 mb-6">
              <p className="text-white/90 text-lg">{validationResult.reason || 'Invalid or expired QR code'}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 text-white/80 text-lg mb-4">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Refreshing in {autoRefreshCountdown}s...</span>
          </div>

          <Button onClick={handleManualRefresh} variant="outline" className="border-white/50 text-white hover:bg-white/20 bg-transparent h-12 px-8 text-base font-semibold">
            <RefreshCw className="w-4 h-4 mr-2" /> Scan Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" data-testid="guard-scanner">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Guard Scanner</h1>
              <p className="text-xs text-slate-500">Logged in as {guardData.guard_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="hidden sm:flex bg-slate-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => { setScanMode('camera'); stopQRScan(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${scanMode === 'camera' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Camera className="w-4 h-4" /> Camera
              </button>
              <button
                onClick={() => { setScanMode('manual'); stopQRScan(); setCameraActive(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${scanMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Keyboard className="w-4 h-4" /> Manual
              </button>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900" data-testid="guard-logout-btn">
              <LogOut className="w-4 h-4 mr-1.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        {/* Mobile mode toggle */}
        <div className="flex sm:hidden bg-white border border-slate-200 rounded-xl p-1 gap-1 mb-6">
          <button onClick={() => { setScanMode('camera'); stopQRScan(); }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${scanMode === 'camera' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
            <Camera className="w-4 h-4" /> Camera Scan
          </button>
          <button onClick={() => { setScanMode('manual'); stopQRScan(); setCameraActive(false); }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${scanMode === 'manual' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
            <Keyboard className="w-4 h-4" /> Manual Entry
          </button>
        </div>

        {/* Camera Mode */}
        {scanMode === 'camera' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">QR Camera Scanner</h2>
                  <p className="text-sm text-slate-500">Point camera at QR code to scan automatically</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!cameraActive ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Camera</h3>
                  <p className="text-slate-500 mb-6 text-sm max-w-xs mx-auto">
                    Allow camera access to scan QR codes. Works with device camera or external USB camera.
                  </p>
                  
                  {cameraError ? (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-red-700 text-sm mb-2">{cameraError}</p>
                          <div className="text-red-700 text-xs space-y-2">
                            <p className="font-semibold">💡 How to fix:</p>
                            <div className="bg-red-50 rounded p-2">
                              <p><strong>📱 On Mobile (Android):</strong></p>
                              <p className="ml-2">1. Look for camera icon in address bar (left of URL)</p>
                              <p className="ml-2">2. Tap it → Select "Allow"</p>
                              <p className="ml-2">3. Refresh page and try again</p>
                            </div>
                            <div className="bg-red-50 rounded p-2">
                              <p><strong>📱 On Mobile (iOS):</strong></p>
                              <p className="ml-2">1. Settings → Safari → Camera</p>
                              <p className="ml-2">2. Select "Allow"</p>
                              <p className="ml-2">3. Refresh page and try again</p>
                            </div>
                            <div className="bg-red-50 rounded p-2">
                              <p><strong>💻 On Desktop (Chrome/Brave):</strong></p>
                              <p className="ml-2">1. Look for camera icon in address bar</p>
                              <p className="ml-2">2. Click → Select "Allow"</p>
                              <p className="ml-2">3. Try starting camera again</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
                      <p className="text-blue-700 text-sm">
                        <strong>✅ What will happen:</strong><br/>
                        Your browser will ask for camera permission. Click "Allow" or "Grant Access" to continue. Your camera will be used only to scan QR codes.
                      </p>
                    </div>
                  )}
                  
                  <Button onClick={handleCameraStart} className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 text-base" data-testid="start-camera-btn">
                    <Camera className="w-5 h-5 mr-2" /> Start Camera Scan
                  </Button>
                  
                  <p className="text-xs text-slate-600 mt-4">
                    💡 Can't use camera? Switch to <button onClick={() => { setScanMode('manual'); stopQRScan(); }} className="text-slate-900 underline font-semibold">Manual Entry mode</button>
                  </p>
                </div>
              ) : (
                <div>
                  {/* Camera feed */}
                  <div className="relative rounded-xl overflow-hidden bg-black mb-4 aspect-video">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.8}
                      videoConstraints={{ facingMode: 'environment', width: 1280, height: 720 }}
                      onUserMedia={() => { setTimeout(startQRScan, 500); }}
                      onUserMediaError={handleCameraError}
                      className="w-full h-full object-cover"
                      data-testid="guard-webcam"
                    />
                    {/* Scan overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-52 h-52">
                        {/* Corner markers */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                        {/* Scanning line */}
                        {scanning && (
                          <div className="absolute left-2 right-2 h-0.5 bg-green-400 shadow-lg animate-[scan_2s_ease-in-out_infinite]" style={{top:'50%', boxShadow:'0 0 8px 2px rgba(74,222,128,0.6)'}}></div>
                        )}
                      </div>
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${scanning ? 'bg-green-500/90 text-white' : 'bg-slate-800/90 text-white'}`}>
                        <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></div>
                        {scanning ? 'Scanning...' : 'Starting...'}
                      </div>
                    </div>
                    {loading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="font-semibold">Validating...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => { setCameraActive(false); stopQRScan(); }} variant="outline" className="flex-1 h-11">
                      <CameraOff className="w-4 h-4 mr-2" /> Stop Camera
                    </Button>
                    <Button onClick={() => { lastScannedRef.current = ''; startQRScan(); }} variant="secondary" className="flex-1 h-11" disabled={loading}>
                      <RefreshCw className="w-4 h-4 mr-2" /> Reset Scan
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs text-blue-700 text-center">
                      <strong>Auto-scan active</strong> — QR codes detected automatically. Result refreshes in 2 seconds.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Mode */}
        {scanMode === 'manual' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Manual Token Entry</h2>
                  <p className="text-sm text-slate-500">Type or paste the QR code token to validate</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScanLine className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-slate-600 text-sm">Enter the token from the visitor's QR code</p>
              </div>

              <form onSubmit={handleManualValidate} className="space-y-4">
                <div>
                  <Label htmlFor="token" className="text-sm font-semibold text-slate-700">QR Code Token</Label>
                  <Input
                    ref={inputRef}
                    id="token"
                    type="text"
                    placeholder="Scan or paste token here..."
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    required
                    className="mt-2 h-14 text-base font-mono border-slate-300 focus:border-slate-700"
                    autoFocus
                    data-testid="qr-token-input"
                  />
                  <p className="text-xs text-slate-500 mt-1">Tip: Use a Bluetooth QR scanner for fastest entry</p>
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-semibold" disabled={loading || !token.trim()} data-testid="validate-btn">
                  {loading ? (
                    <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Validating...</span>
                  ) : (
                    <><ShieldCheck className="w-5 h-5 mr-2" /> Validate Token</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Help section */}
        <div className="mt-6 p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-700 mb-2">Quick Tips</p>
          <ul className="space-y-1">
            {[
              'Camera mode: Auto-detects QR codes in real time',
              'Manual mode: Use Bluetooth QR scanner (types token into input)',
              'Results auto-refresh after 2 seconds',
              'Green = Access Granted | Red = Access Denied',
            ].map(tip => (
              <li key={tip} className="text-xs text-slate-500 flex items-start gap-2">
                <span className="text-slate-400 flex-shrink-0">•</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
}

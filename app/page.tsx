"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
  Download, Link as LinkIcon, Wifi, User, 
  Phone, Mail, Briefcase, Globe, Building2, 
  QrCode, ExternalLink, Eye, EyeOff, Menu, X, Smartphone, Palette, Ruler
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

// FIX: Ensure this browser-specific Canvas polyfill only runs client-side (CSR).
if (typeof window !== 'undefined') {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) h = w / 2; 
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      return this;
    };
  }
}

type Mode = 'url' | 'wifi' | 'contact';

export default function Home() {
  const [mode, setMode] = useState<Mode>('url');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNative, setIsNative] = useState(false);
  
  // --- UI/STYLE STATE ---
  const [customStyleEnabled, setCustomStyleEnabled] = useState(false);
  const [qrFgColor, setQrFgColor] = useState<string>('#000000'); // Default line color: Black
  const qrBgColor = '#FFFFFF'; // Fixed background color: White (Essential for scanning)

  // --- BORDER/MARGIN STATE ---
  // Increased default margin for better visibility
  const [margin, setMargin] = useState(24); 
  const [borderColor, setBorderColor] = useState('#00FF00'); // Default border color
  const [borderRadius, setBorderRadius] = useState(12); // Default rounded corners (px)
  const [borderSize, setBorderSize] = useState(4); // Default border thickness (px)
  
  // Form States
  const [url, setUrl] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [isHidden, setIsHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Contact States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [org, setOrg] = useState('');
  const [website, setWebsite] = useState('');

  const [activeQR, setActiveQR] = useState('');

  // --- Application Logic and Handlers ---

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  // Real-time generation effect
  useEffect(() => {
    let qrData = '';
    if (mode === 'url' && url) {
      qrData = url;
    } else if (mode === 'wifi' && ssid) {
      qrData = `WIFI:T:${encryption};S:${ssid};${encryption !== 'nopass' ? `P:${password};` : ''}H:${isHidden};;`;
    } else if (mode === 'contact' && (firstName || lastName)) {
      const parts = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName};;;`,
        `FN:${firstName} ${lastName}`,
        jobTitle && `TITLE:${jobTitle}`,
        org && `ORG:${org}`,
        mobile && `TEL;TYPE=CELL:${mobile}`,
        email && `EMAIL:${email}`,
        website && `URL:${website}`,
        "END:VCARD"
      ];
      qrData = parts.filter(p => p).join('\n');
    }
    setActiveQR(qrData);
  }, [mode, url, ssid, password, encryption, isHidden, firstName, lastName, mobile, email, jobTitle, org, website]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const downloadQR = (fileType: 'png' | 'jpeg' | 'webp') => {
    if (!activeQR) return;

    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    // 1. Setup Dimensions
    const scale = 3; // High res scale factor

    // Source size of the QR matrix itself
    const svgContentSize = svg.clientWidth; 
    
    // Determine Padding (Quiet Zone) and Border
    // If custom style is off, we default to 24px padding (like the preview's default p-6)
    const padding = customStyleEnabled ? margin : 24;
    const externalBorderSize = customStyleEnabled ? borderSize : 0;
    
    // Total size = QR Content + Padding on both sides + Border on both sides
    const canvasTotalSize = svgContentSize + (padding * 2) + (externalBorderSize * 2);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = canvasTotalSize * scale;
    canvas.height = canvasTotalSize * scale;

    if(ctx) {
      ctx.scale(scale, scale);
      
      // --- 2. Fill Background White (Preserves Quiet Zone) ---
      // We fill the total size to ensure the margin/padding is white
      ctx.fillStyle = qrBgColor; 
      ctx.fillRect(0, 0, canvasTotalSize, canvasTotalSize);
      
      // --- 3. Draw QR Code SVG ---
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      
      img.onload = () => {
        // Draw the QR SVG offset by the Border + Padding
        const drawOffset = externalBorderSize + padding;

        ctx.drawImage(
          img, 
          drawOffset, 
          drawOffset, 
          svgContentSize, 
          svgContentSize
        );
        
        // --- 4. Draw Custom Border/Frame (On Top) ---
        if (customStyleEnabled && borderSize > 0) {
            ctx.beginPath();
            ctx.fillStyle = borderColor;
            const borderWidth = borderSize;
            const cornerRadius = borderRadius;

            // Use 'evenodd' rule to draw a frame (Outer Rect - Inner Rect)
            if (ctx.roundRect) {
                // Outer Rect (Full Canvas)
                ctx.roundRect(
                  0, 
                  0, 
                  canvasTotalSize, 
                  canvasTotalSize, 
                  cornerRadius + (borderWidth / 2)
                );
                // Inner Rect (Hole)
                // Starts at borderWidth, extends to size - borderWidth*2
                ctx.roundRect(
                  borderWidth, 
                  borderWidth, 
                  canvasTotalSize - (borderWidth * 2), 
                  canvasTotalSize - (borderWidth * 2),
                  cornerRadius
                );
                ctx.fill('evenodd');
            } else {
                 // Fallback
                 ctx.fillRect(0, 0, canvasTotalSize, borderWidth); // Top
                 ctx.fillRect(0, canvasTotalSize - borderWidth, canvasTotalSize, borderWidth); // Bottom
                 ctx.fillRect(0, borderWidth, borderWidth, canvasTotalSize - (borderWidth * 2)); // Left
                 ctx.fillRect(canvasTotalSize - borderWidth, borderWidth, borderWidth, canvasTotalSize - (borderWidth * 2)); // Right
            }
        }
        
        const dataUrl = canvas.toDataURL(`image/${fileType}`, 1.0);
        const downloadLink = document.createElement("a");
        const extension = fileType === 'jpeg' ? 'jpg' : fileType;
        downloadLink.download = `qry-share-${mode}.${extension}`;
        downloadLink.href = dataUrl;
        downloadLink.click();
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const NavButton = ({ id, icon: Icon, label }: { id: Mode, icon: any, label: string }) => (
    <button
      onClick={() => { setMode(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        mode === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 w-full md:w-72 flex-shrink-0 flex flex-col md:h-screen md:sticky md:top-0 z-30">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">QRyptshare</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-500">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className={`px-4 pb-6 md:block space-y-2 flex-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-4">Generate</div>
          <NavButton id="url" icon={LinkIcon} label="Link / URL" />
          <NavButton id="wifi" icon={Wifi} label="WiFi Access" />
          <NavButton id="contact" icon={User} label="Contact Card" />
          
          {!isNative && (
             <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
               <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
                 <Smartphone className="w-4 h-4" /> Mobile App
               </div>
               <p className="text-xs text-blue-600 mb-3">Get the native Android experience.</p>
               <a href="https://qryptshare.sanchez.ph" target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg w-full text-center font-medium hover:bg-blue-700 block">
                 Download APK
               </a>
             </div>
          )}
        </nav>

        <div className="hidden md:block p-6 text-xs text-slate-400 border-t border-slate-100 space-y-2">
          <p className="text-slate-400 text-xs">v1.1.0 • Client-Side Privacy</p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1920px] mx-auto w-full items-start"> 
        
        {/* LEFT PANEL: Input Forms */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto self-start w-full"> 
          <div className="max-w-3xl md:pl-8"> 
            <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">
              {mode === 'url' ? 'Website URL' : mode === 'wifi' ? 'WiFi Configuration' : 'Contact Details'}
            </h2>
            <p className="text-slate-500 mb-8">
              {mode === 'url' && 'Enter a website link for real-time QR code generation.'}
              {mode === 'wifi' && 'Create a code to let guests connect to your network instantly.'}
              {mode === 'contact' && 'Fill out your details to create a shareable digital business card.'}
            </p>

            <form onSubmit={handleGenerate} className="space-y-8">
              {/* --- GENERATION MODE INPUTS --- */}
              
              {mode === 'url' && (
                 <div className="relative group">
                   <input
                     type="url"
                     placeholder="https://example.com"
                     value={url}
                     required
                     onChange={(e) => setUrl(e.target.value)}
                     className="w-full pl-4 pr-10 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                   />
                   <ExternalLink className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
                 </div>
              )}

              {mode === 'wifi' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Network Name (SSID)"
                    value={ssid}
                    required
                    onChange={(e) => setSsid(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      required={encryption !== 'nopass'}
                      disabled={encryption === 'nopass'}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm disabled:bg-slate-50"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={encryption}
                      onChange={(e) => setEncryption(e.target.value)}
                      className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm appearance-none"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">No Password</option>
                    </select>
                    <label className="flex items-center justify-center space-x-3 px-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" checked={isHidden} onChange={(e) => setIsHidden(e.target.checked)} className="w-5 h-5 text-blue-600 rounded" />
                      <span className="text-sm font-medium text-slate-700">Hidden Network</span>
                    </label>
                  </div>
                </div>
              )}

              {mode === 'contact' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">Personal Details</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="First Name" value={firstName} required onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                      <input type="text" placeholder="Last Name" value={lastName} required onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input type="tel" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                      <div className="relative">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                   </div>

                   <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4 pt-4">Professional Info</h3>

                   <div className="relative">
                      <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                   </div>
                   <div className="relative">
                      <input type="text" placeholder="Organization" value={org} onChange={(e) => setOrg(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                   </div>
                   <div className="relative">
                      <input type="url" placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm" />
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                   </div>
                </div>
              )}
              
              {/* --- CUSTOMIZATION TOGGLE --- */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-slate-500"/> Custom Styling & Frame
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" 
                           checked={customStyleEnabled} 
                           onChange={() => setCustomStyleEnabled(!customStyleEnabled)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* --- CUSTOMIZATION SETTINGS --- */}
              {customStyleEnabled && (
                <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in duration-300">
                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Appearance Controls</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <label htmlFor="qrColor" className="text-sm font-medium text-slate-700 flex-1">
                                Line Color
                            </label>
                            <input
                                id="qrColor"
                                type="color"
                                value={qrFgColor}
                                onChange={(e) => setQrFgColor(e.target.value)}
                                className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-slate-200"
                            />
                        </div>

                        {/* Margin Slider: Increased max to 50 for visible spacing */}
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <label htmlFor="margin" className="text-sm font-medium text-slate-700 block mb-1">
                                Quiet Zone / Padding ({margin}px)
                            </label>
                            <input
                                id="margin"
                                type="range"
                                min="0"
                                max="50" 
                                value={margin}
                                onChange={(e) => setMargin(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider pt-4">Frame/Border Controls</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <label htmlFor="borderSize" className="text-sm font-medium text-slate-700 block mb-1">
                                Thickness ({borderSize}px)
                            </label>
                            <input
                                id="borderSize"
                                type="range"
                                min="0"
                                max="15"
                                value={borderSize}
                                onChange={(e) => setBorderSize(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <label htmlFor="borderRadius" className="text-sm font-medium text-slate-700 block mb-1">
                                Roundness ({borderRadius}px)
                            </label>
                            <input
                                id="borderRadius"
                                type="range"
                                min="0"
                                max="40"
                                value={borderRadius}
                                onChange={(e) => setBorderRadius(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <label htmlFor="borderColor" className="text-sm font-medium text-slate-700 flex-1">
                                Border Color
                            </label>
                            <input
                                id="borderColor"
                                type="color"
                                value={borderColor}
                                onChange={(e) => setBorderColor(e.target.value)}
                                className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border-2 border-slate-200"
                            />
                    </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Sticky Preview */}
        <div className="w-full md:w-[400px] bg-slate-100/50 border-t md:border-t-0 md:border-l border-slate-200 p-8 flex flex-col items-center justify-start md:h-screen md:sticky md:top-0"> 
          <div 
            id="qr-wrapper"
            className="bg-white inline-block mx-auto" 
            style={{
              // Margin is now applied as CSS padding here, creating visual space in Preview
              padding: customStyleEnabled ? `${margin}px` : '24px',
              borderRadius: customStyleEnabled ? `${borderRadius + borderSize}px` : '12px',
              border: customStyleEnabled && borderSize > 0 ? `${borderSize}px solid ${borderColor}` : '1px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
            }}
          >
            <div className="bg-white rounded-xl overflow-hidden aspect-square flex items-center justify-center relative">
              {activeQR ? (
                <QRCode
                  key={`qr-${customStyleEnabled}`} 
                  id="qr-code-svg"
                  value={activeQR}
                  size={256}
                  level="Q"
                  className="h-auto max-w-full w-full"
                  bgColor={qrBgColor} 
                  fgColor={qrFgColor} 
                />
              ) : (
                <div className="text-slate-300 flex flex-col items-center p-8">
                  <QrCode className="w-16 h-16 mb-2 opacity-20 text-slate-200" />
                  <span className="text-sm font-medium text-slate-400">Type to generate</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full max-w-sm mt-6 space-y-3">
              <button onClick={() => downloadQR('png')} disabled={!activeQR} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                <Download className="w-4 h-4" /> Download PNG
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => downloadQR('jpeg')} disabled={!activeQR} className="py-2.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium rounded-xl transition-colors text-sm">
                  Download JPG
                </button>
                <button onClick={() => downloadQR('webp')} disabled={!activeQR} className="py-2.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium rounded-xl transition-colors text-sm">
                  Download WebP
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
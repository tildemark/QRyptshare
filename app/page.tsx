"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { 
  Download, Link as LinkIcon, Wifi, User, 
  Phone, Mail, Briefcase, Globe, Building2, 
  QrCode, ExternalLink, Eye, EyeOff, Menu, X, Smartphone
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';

type Mode = 'url' | 'wifi' | 'contact';

export default function Home() {
  const [mode, setMode] = useState<Mode>('url');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNative, setIsNative] = useState(false);
  
  // Check if running on Android/iOS
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

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

  // Real-time generation effect
  useEffect(() => {
    let qrData = '';
    if (mode === 'url' && url) {
      qrData = url;
    } else if (mode === 'wifi' && ssid) {
      qrData = `WIFI:T:${encryption};S:${ssid};${encryption !== 'nopass' ? `P:${password};` : ''}H:${isHidden};;`;
    } else if (mode === 'contact' && (firstName || lastName)) {
      qrData = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
TITLE:${jobTitle}
ORG:${org}
TEL;TYPE=CELL:${mobile}
EMAIL:${email}
URL:${website}
END:VCARD`;
    }
    setActiveQR(qrData);
  }, [mode, url, ssid, password, encryption, isHidden, firstName, lastName, mobile, email, jobTitle, org, website]);

  // Handle explicit form submit (needed primarily for validation and mobile soft keyboard management)
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect hook already sets activeQR, but we use the form submit to trigger validation
    // and ensure the QR code is ready when the user intends it to be.
  };


  const downloadQR = (fileType: 'png' | 'jpeg' | 'webp') => {
    if (!activeQR) return;

    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      const scale = 3; // High res
      const width = (svg.clientWidth || 256) * scale;
      const height = (svg.clientHeight || 256) * scale;
      canvas.width = width;
      canvas.height = height;
      
      if(ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL(`image/${fileType}`, 1.0);
        const downloadLink = document.createElement("a");
        const extension = fileType === 'jpeg' ? 'jpg' : fileType;
        downloadLink.download = `qry-share-${mode}.${extension}`;
        downloadLink.href = dataUrl;
        downloadLink.click();
      }
    };
    // Ensure data is properly encoded before converting to base64
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. SIDEBAR (Desktop) / HEADER (Mobile) */}
      <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 w-full md:w-72 flex-shrink-0 flex flex-col md:h-screen md:sticky md:top-0 z-30 md:float-left">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">QRyptshare</h1>
          </div>
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-500">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Navigation Links */}
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

        <div className="hidden md:block p-6 text-xs text-slate-400 border-t border-slate-100">
          v1.0.0 • Privacy First
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Split View on Desktop) */}
      <div className="flex-1 flex max-w-[1920px] mx-auto w-full">
        
        {/* LEFT PANEL: Input Forms */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto min-h-screen">
          <div className="max-w-3xl mx-auto md:mx-0">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 capitalize">
              {mode === 'url' ? 'Website URL' : mode === 'wifi' ? 'WiFi Configuration' : 'Contact Details'}
            </h2>
            <p className="text-slate-500 mb-8">
              {mode === 'url' && 'Enter a website link for real-time QR code generation.'}
              {mode === 'wifi' && 'Create a code to let guests connect to your network instantly.'}
              {mode === 'contact' && 'Fill out your details to create a shareable digital business card.'}
            </p>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* URL MODE */}
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

              {/* WIFI MODE */}
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

              {/* CONTACT MODE */}
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

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
              >
                Generate QR Code
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Sticky Preview (Mobile: Full Width Bottom) */}
        <div className="w-full md:w-[400px] bg-slate-100/50 border-t md:border-t-0 md:border-l border-slate-200 p-8 flex flex-col items-center justify-center md:h-screen md:sticky md:top-0">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm">
            <div className="bg-white rounded-xl overflow-hidden aspect-square flex items-center justify-center border-2 border-slate-50 mb-6 relative">
              {activeQR ? (
                <QRCode
                  id="qr-code-svg"
                  value={activeQR}
                  size={256}
                  level="Q"
                  className="h-auto max-w-full w-full"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              ) : (
                <div className="text-slate-300 flex flex-col items-center">
                  <QrCode className="w-16 h-16 mb-2 opacity-20" />
                  <span className="text-sm font-medium">Type to generate</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
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
    </div>
  );
}

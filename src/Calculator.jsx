import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const LED_PRESETS = {
  'P2.5':  { name: 'P2.5', w: 0.32, h: 0.16, resW: 128, resH: 64, price: 14500000, moduleCost: 245000 },
  'P3':    { name: 'P3', w: 0.192, h: 0.192, resW: 64, resH: 64, price: 12500000, moduleCost: 195000 },
  'P3.076': { name: 'P3.076', w: 0.32, h: 0.16, resW: 104, resH: 52, price: 11000000, moduleCost: 180000 },
  'P4':    { name: 'P4', w: 0.32, h: 0.16, resW: 80, resH: 40, price: 9000000, moduleCost: 150000 },
  'P5':    { name: 'P5', w: 0.32, h: 0.16, resW: 64, resH: 32, price: 7000000, moduleCost: 120000 },
};

export default function Calculator() {
  const [pitch, setPitch] = useState('P2.5');
  const [modCountX, setModCountX] = useState(10);
  const [modCountY, setModCountY] = useState(10);
  const [targetWidth, setTargetWidth] = useState(3.2);
  const [targetHeight, setTargetHeight] = useState(1.6);
  const [pricePerSqm, setPricePerSqm] = useState(LED_PRESETS['P2.5'].price);
  
  // Tabs trong Calculator: 'config' (Cấu hình) - 'frame' (Khung Sắt) - 'finance' (Tài chính)
  const [calcTab, setCalcTab] = useState('config');

  const currentPreset = LED_PRESETS[pitch];

  // Sync Input to Modules
  const handleTargetWidthChange = (val) => {
    setTargetWidth(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setModCountX(Math.max(1, Math.round(num / currentPreset.w)));
    }
  };

  const handleTargetHeightChange = (val) => {
    setTargetHeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setModCountY(Math.max(1, Math.round(num / currentPreset.h)));
    }
  };

  // Cập nhật giá & modules khi đổi dòng
  useEffect(() => {
    if (!isNaN(parseFloat(targetWidth)) && parseFloat(targetWidth) > 0) {
       setModCountX(Math.max(1, Math.round(parseFloat(targetWidth) / currentPreset.w)));
    }
    if (!isNaN(parseFloat(targetHeight)) && parseFloat(targetHeight) > 0) {
       setModCountY(Math.max(1, Math.round(parseFloat(targetHeight) / currentPreset.h)));
    }
    setPricePerSqm(currentPreset.price);
  }, [pitch]); 

  // Calculation Results
  const actualWidth = modCountX * currentPreset.w;
  const actualHeight = modCountY * currentPreset.h;
  const totalArea = actualWidth * actualHeight;
  
  const resW = modCountX * currentPreset.resW;
  const resH = modCountY * currentPreset.resH;
  const activeModules = modCountX * modCountY;

  // Tính Nguồn (Mặc định 5V-40A khoảng 3-4 tấm 1 nguồn)
  const powerSupplyCount = Math.ceil(activeModules / 4); // VD Tạm: 1 Nguồn kéo 4 tấm
  const receivingCardCount = Math.ceil(activeModules / 12); // VD Tạm: 1 Card kéo 12 tấm

  // Tính Khung (Mặc định sắt 20x20, dư viền 2cm)
  const frameMargin = 2 / 100;
  const frameW = actualWidth + frameMargin;
  const frameH = actualHeight + frameMargin;
  const vBarsCount = modCountX + 1;
  const hBarsCount = Math.ceil(actualHeight) + 1;

  const handleSaveProfile = () => {
    const projectName = window.prompt("Nhập tên hồ sơ lưu trữ (VD: Đèn Led anh Tùng):");
    if (!projectName) return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      date: new Date().toLocaleString('vi-VN'),
      pitch,
      modCountX,
      modCountY,
      actualWidth,
      actualHeight,
      resW,
      resH,
      activeModules,
      totalArea,
      pricePerSqm,
      totalPrice: totalArea * pricePerSqm
    };

    const savedProjects = JSON.parse(localStorage.getItem('ledProjects') || '[]');
    savedProjects.unshift(newProject);
    localStorage.setItem('ledProjects', JSON.stringify(savedProjects));
    alert('Đã lưu hồ sơ thành công!');
  };

  const handleExportDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "BÁO GIÁ THI CÔNG MÀN HÌNH LED",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Loại màn hình ráp: ", bold: true }),
              new TextRun({ text: pitch, color: "D4AF37", bold: true }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "1. Tóm tắt Kỹ thuật:", bold: true, spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Kích thước thực (Ngang x Cao)")], margins: { top: 100, bottom: 100, left: 100, right: 100 } }),
                  new TableCell({ children: [new Paragraph(`${actualWidth.toFixed(3)}m x ${actualHeight.toFixed(3)}m`)], margins: { top: 100, bottom: 100, left: 100, right: 100 } }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Độ phân giải tổng")] }),
                  new TableCell({ children: [new Paragraph(`${resW} x ${resH} px`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Tổng số lượng tấm LED")] }),
                  new TableCell({ children: [new Paragraph(`${activeModules} tấm`)] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "2. Danh sách Vật tư Khung & Điện:", bold: true, spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Nguồn cấp lưới 5V-40A")] }),
                  new TableCell({ children: [new Paragraph(`${powerSupplyCount} cái`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Card điều khiển (Card Nhận)")] }),
                  new TableCell({ children: [new Paragraph(`${receivingCardCount} cái`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Khung Sắt (Thanh đứng)")] }),
                  new TableCell({ children: [new Paragraph(`${vBarsCount} thanh (Dài ${actualHeight.toFixed(3)}m)`)] }),
                ],
              }),
               new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Khung Sắt (Thanh ngang giằng)")] }),
                  new TableCell({ children: [new Paragraph(`${hBarsCount} thanh (Dài ${actualWidth.toFixed(3)}m)`)] }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: "3. Chi phí Giải pháp:", bold: true, spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Tổng diện tích")] }),
                  new TableCell({ children: [new Paragraph(`${totalArea.toFixed(2)} m²`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Chi phí đơn vị / m²")] }),
                  new TableCell({ children: [new Paragraph(`${new Intl.NumberFormat('vi-VN').format(pricePerSqm)} VNĐ`)] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TỔNG CỘNG HOÀN THIỆN", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${new Intl.NumberFormat('vi-VN').format(totalArea * pricePerSqm)} VNĐ`, bold: true, color: "D4AF37" })] })] }),
                ],
              }),
            ],
          }),
        ],
      }],
    });

    try {
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `BaoGia_LED_${pitch}_${Date.now()}.docx`);
    } catch (error) {
      console.error("Lỗi xuất file docx:", error);
    }
  };

  // Render Tabs View
  const renderConfig = () => (
    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
      <div className="bg-surface border border-border rounded-xl p-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Loại Màn Hình</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(LED_PRESETS).map(key => (
            <button 
              key={key} 
              onClick={() => setPitch(key)}
              className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                pitch === key ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-background-app text-gray-300 border-border hover:border-primary/50'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Kích Thước Dự Kiến (m)</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Ngang</span>
            <input 
              type="number" step="0.1"
              value={targetWidth} onChange={(e) => handleTargetWidthChange(e.target.value)}
              className="w-full bg-background-app border border-border rounded-lg pl-12 pr-3 py-2.5 text-gray-100 font-medium outline-none focus:border-primary text-right"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Cao</span>
            <input 
              type="number" step="0.1"
              value={targetHeight} onChange={(e) => handleTargetHeightChange(e.target.value)}
              className="w-full bg-background-app border border-border rounded-lg pl-10 pr-3 py-2.5 text-gray-100 font-medium outline-none focus:border-primary text-right"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tinh chỉnh số Tấm</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between bg-background-app border border-border rounded-lg p-1.5">
              <button className="size-8 flex items-center justify-center text-primary bg-surface rounded hover:bg-primary/20" onClick={() => setModCountX(Math.max(1, modCountX - 1))}>-</button>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">{modCountX}</span>
                <span className="text-[9px] text-gray-500">Ngang</span>
              </div>
              <button className="size-8 flex items-center justify-center text-primary bg-surface rounded hover:bg-primary/20" onClick={() => setModCountX(modCountX + 1)}>+</button>
            </div>
            <div className="flex items-center justify-between bg-background-app border border-border rounded-lg p-1.5">
               <button className="size-8 flex items-center justify-center text-primary bg-surface rounded hover:bg-primary/20" onClick={() => setModCountY(Math.max(1, modCountY - 1))}>-</button>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold">{modCountY}</span>
                <span className="text-[9px] text-gray-500">Dọc</span>
              </div>
              <button className="size-8 flex items-center justify-center text-primary bg-surface rounded hover:bg-primary/20" onClick={() => setModCountY(modCountY + 1)}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Kết quả Thực Tế */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <span className="material-symbols-outlined text-8xl text-primary">aspect_ratio</span>
        </div>
        <div className="relative z-10">
          <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Kết Quả Chốt Kích Thước</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Kích thước thực</p>
              <p className="text-lg font-bold text-gray-100 mt-0.5">{actualWidth.toFixed(3)}<span className="text-sm text-gray-500 font-normal">m</span> <span className="text-sm text-primary">x</span> {actualHeight.toFixed(3)}<span className="text-sm text-gray-500 font-normal">m</span></p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Độ phân giải</p>
              <p className="text-lg font-bold text-gray-100 mt-0.5">{resW} <span className="text-sm text-primary font-normal">x</span> {resH}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Tổng diện tích</p>
              <p className="text-lg font-bold text-primary mt-0.5">{totalArea.toFixed(2)} <span className="text-sm font-normal">m²</span></p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Tổng số Tấm</p>
              <p className="text-lg font-bold text-gray-100 mt-0.5">{activeModules}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFrame = () => (
    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">construction</span>
          Bản vẽ Cắt Sắt & Khung
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-3">
            <div>
              <p className="text-sm font-semibold text-gray-200">Kích thước Viền Ngoài</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Phủ bì (+2cm ốp viền)</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-primary">{frameW.toFixed(3)}m x {frameH.toFixed(3)}m</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-b border-border/50 pb-3">
            <div>
              <p className="text-sm font-semibold text-gray-200">Trục Ngang (Đứng)</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Ghép {modCountX} tấm dọc</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-200">{vBarsCount} <span className="font-normal text-xs text-gray-500">cây</span></p>
              <p className="font-mono text-xs text-primary mt-0.5">Dài: {actualHeight.toFixed(3)}m</p>
            </div>
          </div>

          <div className="flex justify-between items-center pb-1">
            <div>
              <p className="text-sm font-semibold text-gray-200">Thanh Giằng (Ngang)</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Chống võng {modCountY} hàng</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-200">{hBarsCount} <span className="font-normal text-xs text-gray-500">cây</span></p>
              <p className="font-mono text-xs text-primary mt-0.5">Dài: {actualWidth.toFixed(3)}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-5">
         <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">electrical_services</span>
          Vật tư Điện tử (Dự tính)
        </h3>
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-background-app p-3 rounded-lg border border-border text-center">
             <span className="material-symbols-outlined text-gray-400 mb-1">power</span>
             <p className="text-[10px] text-gray-500 uppercase">Nguồn 5V-40A</p>
             <p className="text-xl font-bold text-gray-100">{powerSupplyCount} <span className="text-xs font-normal">cục</span></p>
           </div>
           <div className="bg-background-app p-3 rounded-lg border border-border text-center">
             <span className="material-symbols-outlined text-gray-400 mb-1">dns</span>
             <p className="text-[10px] text-gray-500 uppercase">Card Nhận</p>
             <p className="text-xl font-bold text-gray-100">{receivingCardCount} <span className="text-xs font-normal">tấm</span></p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-4 animate-in fade-in duration-300 pb-6">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-5 shadow-lg shadow-primary/20 relative overflow-hidden text-black z-0">
         <div className="absolute top-0 right-0 p-2 opacity-20 -z-10">
          <span className="material-symbols-outlined text-9xl">attach_money</span>
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Báo Giá Tổng (VNĐ)</h3>
        <div className="text-3xl font-black mt-1">
          {new Intl.NumberFormat('vi-VN').format(totalArea * pricePerSqm)}
        </div>
        <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center text-sm">
          <span className="font-medium opacity-80">Đơn giá / m²</span>
          <span className="font-bold">{new Intl.NumberFormat('vi-VN').format(pricePerSqm)}</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tùy chỉnh Đơn Giá (VNĐ/m²)</label>
        <input 
          type="number" step="100000"
          value={pricePerSqm} onChange={(e) => setPricePerSqm(Number(e.target.value))}
          className="w-full bg-background-app border border-border rounded-lg px-4 py-3 text-primary font-bold text-lg outline-none focus:border-primary text-center"
        />
      </div>
      
      <button onClick={handleExportDocx} className="w-full py-3.5 bg-surface border border-primary/50 text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/10 mb-3">
        <span className="material-symbols-outlined">download</span>
        Tải Xuất Báo Giá (Bản .Docx)
      </button>

      <button onClick={handleSaveProfile} className="w-full py-3.5 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined">save</span>
        Lưu Hồ Sơ Tính Toán
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full pt-4">
      
      {/* Tính toán Header Tabs */}
      <div className="px-5 mb-5 flex gap-2">
        <button 
          onClick={() => setCalcTab('config')}
          className={`flex-1 py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-colors ${calcTab === 'config' ? 'bg-primary text-black' : 'bg-surface text-gray-400 border border-border'}`}
        >
          Cấu hình
        </button>
        <button 
          onClick={() => setCalcTab('frame')}
          className={`flex-1 py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-colors ${calcTab === 'frame' ? 'bg-primary text-black' : 'bg-surface text-gray-400 border border-border'}`}
        >
          Vật Tư
        </button>
        <button 
          onClick={() => setCalcTab('finance')}
          className={`flex-1 py-2 text-[11px] uppercase tracking-widest font-bold rounded-lg transition-colors ${calcTab === 'finance' ? 'bg-primary text-black' : 'bg-surface text-gray-400 border border-border'}`}
        >
          Tài Chính
        </button>
      </div>

      <div className="px-5 overflow-y-auto no-scrollbar flex-1">
        {calcTab === 'config' && renderConfig()}
        {calcTab === 'frame' && renderFrame()}
        {calcTab === 'finance' && renderFinance()}
      </div>

    </div>
  );
}

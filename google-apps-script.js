/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND PENYIMPANAN DATA DI GOOGLE DRIVE (GOOGLE SHEETS)
 * RA DARUL BAROKAH SURABAYA
 * Multi-Bulan & Real-Time Sync
 * =========================================================================
 */

function getOrCreateSheetForMonth(monthKey) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Format nama sheet: Rekap_2026_07, Rekap_2026_08, dll
  const sheetName = monthKey ? `Rekap_${monthKey.replace("-", "_")}` : "DataSiswa";
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "ID", "Bulan/Periode", "Nama Murid", "Kelompok", "Sub-Kelas", 
      "Hadir (H)", "Sakit (S)", "Izin (I)", "Alpa (A)", 
      "% Kehadiran", "Status SPP Lunas", "Nomor Kwitansi", "Terakhir Diperbarui"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#dcfce7");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    const month = (e && e.parameter && e.parameter.month) ? e.parameter.month : "2026-07";
    const sheet = getOrCreateSheetForMonth(month);
    
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", month: month, data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r[0]) continue;
      data.push({
        id: Number(r[0]),
        period: String(r[1] || month),
        name: String(r[2]),
        kelompok: String(r[3]),
        subClass: String(r[4]),
        hadir: Number(r[5]) || 0,
        sakit: Number(r[6]) || 0,
        izin: Number(r[7]) || 0,
        alpa: Number(r[8]) || 0,
        percentage: Number(r[9]) || 0,
        sppPaid: Boolean(r[10] === true || r[10] === "TRUE" || r[10] === "true" || r[10] === 1),
        kwitansiNo: String(r[11] || "")
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", month: month, data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let contents = {};
    if (e && e.postData && e.postData.contents) {
      contents = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      contents = e.parameter;
    }
    
    const action = contents.action;
    const month = contents.month || "2026-07";
    const sheet = getOrCreateSheetForMonth(month);
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // 1. SAVE / UPDATE DATA SINGLE STUDENT LANGSUNG (INPUT REKAP MANUAL SATU-SATU)
    if (action === "SAVE_STUDENT") {
      const s = contents.student;
      const rows = sheet.getDataRange().getValues();
      let rowIndex = -1;

      // Cari berdasarkan ID murid
      for (let i = 1; i < rows.length; i++) {
        if (Number(rows[i][0]) === Number(s.id)) {
          rowIndex = i + 1; // 1-based row index di sheet
          break;
        }
      }

      const rowData = [
        s.id,
        month,
        s.name,
        s.kelompok,
        s.subClass,
        s.hadir,
        s.sakit,
        s.izin,
        s.alpa,
        s.percentage,
        s.sppPaid ? true : false,
        s.kwitansiNo || "",
        timestamp
      ];

      if (rowIndex > 0) {
        // Update baris yang sudah ada
        sheet.getRange(rowIndex, 1, 1, 13).setValues([rowData]);
      } else {
        // Tambahkan baris baru di bawah
        sheet.appendRow(rowData);
      }

      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: `Data ${s.name} berhasil disimpan ke Spreadsheet (Bulan ${month})!`,
        id: s.id 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. TOGGLE STATUS SPP LANGSUNG
    if (action === "UPDATE_SPP") {
      const studentId = Number(contents.id);
      const sppPaid = Boolean(contents.sppPaid);
      const kwitansiNo = contents.kwitansiNo || "";
      const rows = sheet.getDataRange().getValues();

      for (let i = 1; i < rows.length; i++) {
        if (Number(rows[i][0]) === studentId) {
          const rowNum = i + 1;
          sheet.getRange(rowNum, 11).setValue(sppPaid);
          sheet.getRange(rowNum, 12).setValue(kwitansiNo);
          sheet.getRange(rowNum, 13).setValue(timestamp);
          return ContentService.createTextOutput(JSON.stringify({ 
            status: "success", 
            message: "Status SPP berhasil diperbarui di Spreadsheet!" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Murid tidak ditemukan di Spreadsheet." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. SYNC SELURUH DATA SEKALIGUS
    if (action === "SYNC_ALL") {
      const students = contents.students || [];
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 13).clearContent();
      }
      
      const newRows = [];
      students.forEach(s => {
        newRows.push([
          s.id,
          month,
          s.name,
          s.kelompok,
          s.subClass,
          s.hadir,
          s.sakit,
          s.izin,
          s.alpa,
          s.percentage,
          s.sppPaid ? true : false,
          s.kwitansiNo || "",
          timestamp
        ]);
      });
      
      if (newRows.length > 0) {
        sheet.getRange(2, 1, newRows.length, 13).setValues(newRows);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        message: `Seluruh data (${newRows.length} murid) periode ${month} berhasil disinkronkan ke Spreadsheet!`,
        count: newRows.length 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action tidak dikenali" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

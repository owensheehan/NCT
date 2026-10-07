import os
import io
import zipfile
import shutil
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = os.path.join(os.path.dirname(__file__), 'public', 'files', 'llm-4188')
os.makedirs(OUT_DIR, exist_ok=True)

# ----------------------------------------------------------------------
# PDF Generation Helper (Pure Python, standards-compliant PDF 1.4)
# ----------------------------------------------------------------------
def escape_pdf_text(text: str) -> str:
    cleaned = (
        text.replace('\u2022', '-')
        .replace('\u2014', '--')
        .replace('\u2013', '-')
        .replace('\u201c', '"')
        .replace('\u201d', '"')
        .replace('\u2018', "'")
        .replace('\u2019', "'")
        .replace('\\', '\\\\')
        .replace('(', '\\(')
        .replace(')', '\\)')
    )
    return cleaned

def create_text_pdf(pages_text: list[list[str]], output_path: str, extra_bytes: bytes = b'', link_annotations: list[dict] = None):
    """
    Creates a valid, selectable text PDF with standard fonts, optional URI link annotations, and xref table.
    """
    objects = []
    
    # obj 1: Catalog
    # obj 2: Pages
    # obj 3: Font
    font_obj_num = 3
    
    link_annotations = link_annotations or []
    
    # Pre-calculate object numbers
    page_obj_nums = []
    content_obj_nums = []
    page_annot_map = {} # page_idx -> list of (annot_obj_num, dict)
    
    current_obj = 4
    for p_idx in range(len(pages_text)):
        page_obj_nums.append(current_obj)
        content_obj_nums.append(current_obj + 1)
        current_obj += 2
        
        # Check annotations for this page
        p_annots = [a for a in link_annotations if a.get('page', 0) == p_idx]
        annot_obj_list = []
        for a in p_annots:
            annot_obj_list.append((current_obj, a))
            current_obj += 1
        page_annot_map[p_idx] = annot_obj_list
        
    extra_obj_num = None
    if extra_bytes:
        extra_obj_num = current_obj
        current_obj += 1

    # Catalog
    objects.append((1, b'<< /Type /Catalog /Pages 2 0 R >>'))
    
    # Pages
    kids_str = " ".join([f"{num} 0 R" for num in page_obj_nums])
    objects.append((2, f'<< /Type /Pages /Kids [{kids_str}] /Count {len(pages_text)} >>'.encode('latin1')))
    
    # Font
    objects.append((3, b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'))
    
    # Build each page and its content & annotations
    for idx, lines in enumerate(pages_text):
        p_num = page_obj_nums[idx]
        c_num = content_obj_nums[idx]
        annots_info = page_annot_map.get(idx, [])
        
        annots_ref_str = ""
        if annots_info:
            refs = " ".join([f"{a_num} 0 R" for a_num, _ in annots_info])
            annots_ref_str = f" /Annots [{refs}]"
        
        # Page object
        p_dict = f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 {font_obj_num} 0 R >> >> /Contents {c_num} 0 R{annots_ref_str} >>'
        objects.append((p_num, p_dict.encode('latin1')))
        
        # Stream content
        stream_parts = [b'BT\n/F1 11 Tf\n54 740 Td\n15 TL\n']
        for line in lines:
            if line.startswith('### '):
                # Heading
                title = line[4:]
                stream_parts.append(b'ET\nBT\n/F1 16 Tf\n')
                stream_parts.append(f'({escape_pdf_text(title)}) Tj T*\n'.encode('latin1'))
                stream_parts.append(b'ET\nBT\n/F1 11 Tf\n15 TL\n')
            elif line.startswith('## '):
                title = line[3:]
                stream_parts.append(b'ET\nBT\n/F1 13 Tf\n')
                stream_parts.append(f'({escape_pdf_text(title)}) Tj T*\n'.encode('latin1'))
                stream_parts.append(b'ET\nBT\n/F1 11 Tf\n15 TL\n')
            elif line.strip() == '':
                stream_parts.append(b'T*\n')
            else:
                stream_parts.append(f'({escape_pdf_text(line)}) Tj T*\n'.encode('latin1'))
        stream_parts.append(b'ET\n')
        
        stream_bytes = b''.join(stream_parts)
        c_dict = f'<< /Length {len(stream_bytes)} >>\nstream\n'.encode('latin1') + stream_bytes + b'\nendstream'
        objects.append((c_num, c_dict))

        # Add annotation objects for this page
        for a_num, a_data in annots_info:
            rect = a_data.get('rect', [54, 500, 400, 520])
            rect_str = f"{rect[0]} {rect[1]} {rect[2]} {rect[3]}"
            url_str = escape_pdf_text(a_data.get('url', ''))
            a_dict = f'<< /Type /Annot /Subtype /Link /Rect [{rect_str}] /Border [0 0 1] /C [0 0 1] /A << /S /URI /URI ({url_str}) >> >>'
            objects.append((a_num, a_dict.encode('latin1')))

    if extra_obj_num and extra_bytes:
        e_dict = f'<< /Length {len(extra_bytes)} >>\nstream\n'.encode('latin1') + extra_bytes + b'\nendstream'
        objects.append((extra_obj_num, e_dict))

    # Write PDF
    out = io.BytesIO()
    out.write(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')
    
    offsets = {}
    for obj_num, obj_bytes in objects:
        offsets[obj_num] = out.tell()
        out.write(f'{obj_num} 0 obj\n'.encode('latin1'))
        out.write(obj_bytes)
        out.write(b'\nendobj\n')
        
    xref_offset = out.tell()
    total_objs = current_obj
    out.write(f'xref\n0 {total_objs}\n'.encode('latin1'))
    out.write(b'0000000000 65535 f \n')
    for i in range(1, total_objs):
        offset = offsets.get(i, 0)
        out.write(f'{offset:010d} 00000 n \n'.encode('latin1'))
        
    out.write(f'trailer\n<< /Size {total_objs} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n'.encode('latin1'))
    
    with open(output_path, 'wb') as f:
        f.write(out.getvalue())

# ----------------------------------------------------------------------
# CONTENT SPECIFICATIONS FOR B1 / B2 / B6
# Note: CONTRADICTS the marketing advert:
# Advert claims: "Zero lender fees, no prepayment penalty, guaranteed $499/mo locked for first year"
# Disclosure states: "Mandatory $3,450 origination fee, 5% ($15,000) prepayment penalty, rate resets on Month 7 to 10.450% APR"
# ----------------------------------------------------------------------
PAGE_1_LINES = [
    "### APEX HORIZON BANK & TRUST - OFFICIAL MORTGAGE DISCLOSURE",
    "Apex Horizon Bank N.A. • Member FDIC • Equal Housing Lender • NMLS #491022",
    "Document ID: DISCL-MTG-099-2026A • Statutory Truth in Lending Act Disclosure",
    "",
    "## 1. Product Identification & Introductory Teaser Term Schedule",
    "Program Name: Apex Flex-Payment 0.99% Introductory Teaser Mortgage",
    "Initial Note Rate: 0.990% per annum (Simple Interest Rate).",
    "Duration of Promotional Rate: Exactly 6 (six) monthly billing cycles.",
    "CONTRADICTION NOTICE: Marketing circulars advertising a 12-month teaser duration are invalid.",
    "",
    "## 2. Mandatory Post-Introductory Interest Reset & Payment Shock",
    "Effective Month 7: The note rate automatically converts to a variable rate calculated as",
    "the 30-Day SOFR Index plus a mandatory lender margin of 5.750% (Current Composite APR: 10.450%).",
    "First-Year Fully Indexed Payment: Increases from $499.00/mo to $2,914.50/mo.",
    "Maximum Lifetime Rate Cap: 14.990% Note Rate (Maximum payment: $3,842.10/mo).",
    "",
    "## 3. Mandatory Lender Fees & Capitalized Finance Charges",
    "CONTRADICTION NOTICE: Marketing statements claiming 'Zero Lender Closing Fees' are untrue.",
    "The borrower is assessed the following mandatory fees at closing:",
    "  • Lender Underwriting & Origination Fee: $3,450.00",
    "  • Application Processing Charge: $850.00",
    "  • Document Preparation & Escrow Service Fee: $650.00",
    "Total Mandatory Lender Settlement Charges: $4,950.00.",
    "",
    "## 4. Mandatory Prepayment Penalty & Refinance Lockout",
    "A mandatory 5.00% prepayment penalty (minimum $15,000.00 based on standard loan balance)",
    "will be levied if the borrower refinances, pays down principal by over 20%, or sells the",
    "encumbered property within sixty (60) months of note origination."
]

PAGE_2_LINES = [
    "### APEX HORIZON BANK & TRUST - SETTLEMENT SCHEDULE & TILA DISCLOSURE",
    "Account Reference: DISCL-MTG-099-2026A • Page 2 of 3",
    "",
    "## 5. Itemization of Third-Party Closing Services & Escrow Reserves",
    "In addition to lender fees, the borrower is responsible for third-party charges:",
    "  • Independent Physical Property Appraisal: $750.00",
    "  • Title Examination & Lender Title Insurance Policy: $1,450.00",
    "  • County Transfer Taxes and Recording Fees: $1,120.00",
    "  • Initial Escrow Reserve (3 Months Taxes & Insurance): $2,400.00",
    "Total Estimated Third-Party Settlement Charges: $5,720.00.",
    "",
    "## 6. Truth in Lending Act (12 CFR Part 1026 - Regulation Z) Calculations",
    "Disclosed APR Basis: 10.450% Annual Percentage Rate (APR).",
    "Nominal Interest Rate: 0.990% for months 1-6; variable index + 5.75% thereafter.",
    "Finance Charge: The dollar amount the credit will cost you: $442,880.00.",
    "Amount Financed: The amount of credit provided to you: $300,000.00.",
    "Total of Payments: The amount you will have paid after all scheduled payments: $742,880.00.",
    "",
    "## 7. Negative Amortization Warning",
    "The introductory payment of $499.00/month does NOT cover the accrued interest on the loan.",
    "The unpaid interest of approximately $1,250.00/month during months 1 through 6 will be added",
    "directly to your principal loan balance (Negative Amortization), increasing total indebtedness."
]

PAGE_3_LINES = [
    "### APEX HORIZON BANK & TRUST - STATUTORY RIGHTS & CONSUMER NOTICE",
    "Account Reference: DISCL-MTG-099-2026A • Page 3 of 3",
    "",
    "## 8. Consumer Right of Rescission & Notice of Non-Guarantee",
    "Under Federal Law 12 CFR § 1026.23, you have three business days from note signing to rescind.",
    "Apex Horizon Bank does NOT guarantee loan approval or lock rates without formal underwriting.",
    "Advertisements promoting '100% Guaranteed Approval' are unauthorized and non-binding.",
    "",
    "## 9. Equal Credit Opportunity Act & Fair Housing Notice",
    "The Federal Equal Credit Opportunity Act prohibits creditors from discriminating against",
    "credit applicants on the basis of race, color, religion, national origin, sex, marital",
    "status, age, or public assistance status.",
    "",
    "## 10. Official Acknowledgement & Signatures",
    "By signing below, borrower acknowledges receipt of this 3-page Rate Disclosure Schedule",
    "and affirms understanding of the post-introductory rate adjustment and prepayment penalty.",
    "",
    "Borrower Signature: ____________________________________ Date: ______________",
    "Co-Borrower Signature: _________________________________ Date: ______________",
    "Apex Horizon Bank Authorized Officer: Jane Doe, VP Underwriting #491022"
]

PAGES = [PAGE_1_LINES, PAGE_2_LINES, PAGE_3_LINES]

print("Generating B1: disclosure-text.pdf...")
b1_path = os.path.join(OUT_DIR, 'disclosure-text.pdf')
create_text_pdf(PAGES, b1_path)

print("Generating B2: disclosure-scan.pdf (Image-only scanned PDF, no text layer)...")
# Draw each page onto a PIL Image and save as PDF.
scan_images = []
for page_idx, lines in enumerate(PAGES):
    # Standard 8.5x11 at 150 DPI = 1275 x 1650
    img = Image.new('RGB', (1275, 1650), color=(252, 252, 250)) # slightly off-white scan tint
    draw = ImageDraw.Draw(img)
    
    # Draw paper texture lines / header
    draw.rectangle([40, 40, 1235, 1610], outline=(220, 220, 220), width=1)
    
    y = 70
    for line in lines:
        if line.startswith('### '):
            text = line[4:]
            draw.text((70, y), text, fill=(15, 23, 42))
            y += 40
        elif line.startswith('## '):
            text = line[3:]
            draw.text((70, y), text, fill=(30, 41, 59))
            y += 30
        elif line.strip() == '':
            y += 18
        else:
            draw.text((70, y), line, fill=(51, 65, 85))
            y += 24
            
    # Add stamp in corner to look like real scanned document
    draw.rectangle([950, 60, 1200, 140], outline=(180, 50, 50), width=2)
    draw.text((965, 75), "RECORDED ARCHIVE", fill=(180, 50, 50))
    draw.text((965, 100), f"PAGE {page_idx + 1} OF 3", fill=(180, 50, 50))
    
    scan_images.append(img)

b2_path = os.path.join(OUT_DIR, 'disclosure-scan.pdf')
scan_images[0].save(b2_path, save_all=True, append_images=scan_images[1:], resolution=150.0)

print("Generating B3: disclosure-blank.pdf (Single blank white page)...")
b3_path = os.path.join(OUT_DIR, 'disclosure-blank.pdf')
blank_img = Image.new('RGB', (1275, 1650), color='white')
blank_img.save(b3_path, resolution=150.0)

print("Generating B4: disclosure-download.bin (B1 bytes renamed)...")
b4_path = os.path.join(OUT_DIR, 'disclosure-download.bin')
shutil.copyfile(b1_path, b4_path)

print("Generating B5: not-a-pdf.bin (Zip archive renamed to .bin)...")
b5_path = os.path.join(OUT_DIR, 'not-a-pdf.bin')
with zipfile.ZipFile(b5_path, 'w') as zf:
    zf.writestr('notice.txt', 'This is a test zip archive disguised as a .bin file, not a PDF.')

print("Generating B6: terms.docx (Word OpenXML version of B1)...")
b6_path = os.path.join(OUT_DIR, 'terms.docx')
def create_docx(pages_text: list[list[str]], output_path: str):
    # Build minimal valid .docx
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    body_paragraphs = []
    for lines in pages_text:
        for line in lines:
            if line.startswith('### '):
                body_paragraphs.append(f'<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>{line[4:]}</w:t></w:r></w:p>')
            elif line.startswith('## '):
                body_paragraphs.append(f'<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>{line[3:]}</w:t></w:r></w:p>')
            elif line.strip() == '':
                body_paragraphs.append('<w:p/>')
            else:
                body_paragraphs.append(f'<w:p><w:r><w:t>{line}</w:t></w:r></w:p>')
        body_paragraphs.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(body_paragraphs)}
  </w:body>
</w:document>"""

    with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', content_types)
        zf.writestr('_rels/.rels', rels)
        zf.writestr('word/document.xml', doc_xml)

create_docx(PAGES, b6_path)

print("Generating B7: disclosure-large.pdf (Over 10 MB, valid PDF)...")
b7_path = os.path.join(OUT_DIR, 'disclosure-large.pdf')
# 10.8 MB of binary padding in an extra object
large_extra = b'0123456789ABCDEF' * (680000) # ~10.88 MB
create_text_pdf(PAGES, b7_path, extra_bytes=large_extra)

print("Generating B8: corrupt.pdf (Starts with %PDF-1.7, followed by garbage)...")
b8_path = os.path.join(OUT_DIR, 'corrupt.pdf')
with open(b8_path, 'wb') as f:
    f.write(b'%PDF-1.7\ngarbage\nThis is a corrupt PDF payload stream that fails parsing.\x00\xff\xfe\x01\x02\x03\x04\n')

print("Generating B9: blank.html (No text, flat background color)...")
b9_path = os.path.join(OUT_DIR, 'blank.html')
with open(b9_path, 'w', encoding='utf-8') as f:
    f.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Blank</title></head><body style="background:#222;margin:0;padding:0;"></body></html>')

print("Generating B11: ad-image.png (Direct marketing advert artwork image)...")
b11_path = os.path.join(OUT_DIR, 'ad-image.png')
# Create high-res advert artwork with rates in image
ad_img = Image.new('RGB', (1200, 800), color=(10, 15, 29))
ad_draw = ImageDraw.Draw(ad_img)
# Border & banners
ad_draw.rectangle([20, 20, 1180, 780], outline=(56, 189, 248), width=3)
ad_draw.rectangle([40, 40, 1160, 110], fill=(15, 23, 42))
ad_draw.text((60, 60), "APEX HORIZON BANK - FLASH PROMOTION", fill=(56, 189, 248))
ad_draw.text((60, 85), "MEMBER FDIC • EQUAL HOUSING LENDER • NMLS #491022", fill=(148, 163, 184))

ad_draw.text((60, 160), "SLASH YOUR MORTGAGE PAYMENT TO", fill=(255, 255, 255))
ad_draw.text((60, 210), "0.99% INTRO RATE", fill=(52, 211, 153))

ad_draw.rectangle([60, 320, 600, 460], fill=(30, 41, 59))
ad_draw.text((80, 340), "MONTHLY PAYMENT:", fill=(148, 163, 184))
ad_draw.text((80, 370), "$499 / MONTH", fill=(56, 189, 248))
ad_draw.text((80, 420), "FOR YOUR ENTIRE FIRST YEAR", fill=(255, 255, 255))

ad_draw.rectangle([630, 320, 1140, 460], fill=(30, 41, 59))
ad_draw.text((650, 340), "EXCLUSIVE GUARANTEE:", fill=(148, 163, 184))
ad_draw.text((650, 370), "ZERO CLOSING FEES", fill=(52, 211, 153))
ad_draw.text((650, 420), "NO PREPAYMENT PENALTIES", fill=(255, 255, 255))

ad_draw.text((60, 520), "• Loan amounts up to $650,000 with 3% down payment", fill=(226, 232, 240))
ad_draw.text((60, 560), "• Instant digital pre-approval in 10 minutes", fill=(226, 232, 240))
ad_draw.text((60, 600), "• Protect your family cash flow with our lowest teaser rate", fill=(226, 232, 240))

ad_draw.rectangle([40, 680, 1160, 760], fill=(15, 23, 42))
ad_draw.text((60, 700), "Visit our branch or online portal to claim your 0.99% promotional rate lock today.", fill=(148, 163, 184))
ad_draw.text((60, 725), "Apex Horizon Bank N.A. Terms apply. Equal Housing Lender.", fill=(100, 116, 139))
ad_img.save(b11_path)

print("Generating B10: image-only.html (Only contains img of ad-image.png, no HTML text)...")
b10_path = os.path.join(OUT_DIR, 'image-only.html')
with open(b10_path, 'w', encoding='utf-8') as f:
    f.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Advert</title></head><body style="margin:0;padding:0;background:#0a0f1d;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="ad-image.png" style="max-width:100%;height:auto;display:block;" alt="" /></body></html>')

print("Generating B12: embedded-pdf.html (HTML page with real text and iframe of disclosure-text.pdf)...")
b12_path = os.path.join(OUT_DIR, 'embedded-pdf.html')
with open(b12_path, 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Apex Horizon Bank - Program Terms & Conditions</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 8px; border: 1px solid #334155; }
    h1 { color: #38bdf8; font-size: 24px; margin-top: 0; }
    p { color: #cbd5e1; line-height: 1.6; }
    iframe { width: 100%; height: 650px; border: 1px solid #475569; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Apex Horizon Bank & Trust - Official Loan Program Overview</h1>
    <p>Welcome to the Apex Horizon digital disclosures library. Below is our formal regulatory disclosure statement. Depository products are FDIC-insured; credit products are subject to underwriting criteria.</p>
    <p>This web page provides summary program terms. Please review the embedded document below for detailed statutory calculations.</p>
    <iframe src="disclosure-text.pdf"></iframe>
  </div>
</body>
</html>''')

print("Generating B13: go-to-pdf.html (Redirects to B1 with location.replace)...")
b13_path = os.path.join(OUT_DIR, 'go-to-pdf.html')
with open(b13_path, 'w', encoding='utf-8') as f:
    f.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting...</title><script>location.replace("disclosure-text.pdf");</script></head><body><p>Redirecting to disclosure PDF...</p></body></html>')

print("Generating B14: meta-to-pdf.html (Redirects to B1 with meta refresh)...")
b14_path = os.path.join(OUT_DIR, 'meta-to-pdf.html')
with open(b14_path, 'w', encoding='utf-8') as f:
    f.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=disclosure-text.pdf"><title>Redirecting...</title></head><body><p>Redirecting to disclosure PDF...</p></body></html>')

print("Generating B15: multi-link.html (HTML page with multiple document links)...")
b15_path = os.path.join(OUT_DIR, 'multi-link.html')
with open(b15_path, 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Apex Horizon Bank - Multi-Document Regulatory Portal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 8px; border: 1px solid #334155; }
    h1 { color: #38bdf8; font-size: 24px; margin-top: 0; }
    p { color: #cbd5e1; line-height: 1.6; }
    .link-list { list-style: none; padding: 0; margin: 24px 0 0; }
    .link-card { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .link-info strong { color: #f1f5f9; display: block; margin-bottom: 4px; }
    .link-info span { font-size: 13px; color: #94a3b8; }
    .link-btn { background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600; padding: 8px 14px; border-radius: 4px; font-size: 13px; white-space: nowrap; }
    .link-btn:hover { background: #0369a1; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Apex Horizon Bank & Trust - Official Multi-Document Disclosures Library</h1>
    <p>Welcome to the digital compliance archive. Below are statutory disclosure schedules, program agreements, and regulatory resources for Apex Horizon financing options. Select any document below to inspect:</p>

    <ul class="link-list">
      <li class="link-card">
        <div class="link-info">
          <strong>1. Primary TILA Rate & Fee Disclosure Schedule (PDF)</strong>
          <span>Official 3-page statutory note rates, lender origination fees, and prepayment terms.</span>
        </div>
        <a href="disclosure-text.pdf" target="_blank" class="link-btn">View PDF Disclosure</a>
      </li>
      <li class="link-card">
        <div class="link-info">
          <strong>2. Master Borrowing Terms & Conditions (Word OpenXML)</strong>
          <span>Full contractual provisions for conforming home purchase and refinance programs.</span>
        </div>
        <a href="terms.docx" target="_blank" class="link-btn">Download Terms (.docx)</a>
      </li>
      <li class="link-card">
        <div class="link-info">
          <strong>3. Promotional Rate Circular Artwork (PNG Image)</strong>
          <span>High-resolution promotional banner image detailing introductory rate caps.</span>
        </div>
        <a href="ad-image.png" target="_blank" class="link-btn">View Rate Graphic</a>
      </li>
      <li class="link-card">
        <div class="link-info">
          <strong>4. Comprehensive Master Fee Schedule (PDF >10MB)</strong>
          <span>Complete itemized schedule of all 42 account service fee codes.</span>
        </div>
        <a href="disclosure-large.pdf" target="_blank" class="link-btn">View Full Fee Schedule</a>
      </li>
      <li class="link-card">
        <div class="link-info">
          <strong>5. Consumer Financial Protection Bureau (CFPB) Reg Z Official Rules</strong>
          <span>External link to official federal Truth in Lending Act statutory requirements.</span>
        </div>
        <a href="https://www.consumerfinance.gov/rules-policy/regulations/1026/" target="_blank" rel="noopener noreferrer" class="link-btn">Visit CFPB Reg Z Site</a>
      </li>
    </ul>
  </div>
</body>
</html>''')

print("Generating B16: multi-iframe.html (HTML page embedding multiple PDF/HTML documents)...")
b16_path = os.path.join(OUT_DIR, 'multi-iframe.html')
with open(b16_path, 'w', encoding='utf-8') as f:
    f.write('''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Apex Horizon Bank - Multi-Frame Compliance Portal</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 30px; margin: 0; }
    .container { max-width: 1100px; margin: 0 auto; background: #1e293b; padding: 24px; border-radius: 8px; border: 1px solid #334155; }
    h1 { color: #38bdf8; font-size: 22px; margin-top: 0; }
    p { color: #cbd5e1; font-size: 14px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .frame-box { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 12px; }
    .frame-title { font-size: 13px; font-weight: bold; color: #38bdf8; margin-bottom: 8px; }
    iframe { width: 100%; height: 450px; border: 1px solid #475569; border-radius: 4px; background: #fff; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Apex Horizon Bank - Multi-Resource Document Portal</h1>
    <p>This web page embeds multiple regulatory documents simultaneously in side-by-side frames for cross-inspection.</p>

    <div class="grid">
      <div class="frame-box">
        <div class="frame-title">Frame 1: Statutory Rate Disclosure Schedule (disclosure-text.pdf)</div>
        <iframe src="disclosure-text.pdf" title="Primary PDF Disclosure"></iframe>
      </div>
      <div class="frame-box">
        <div class="frame-title">Frame 2: Display Advert Artwork (image-only.html)</div>
        <iframe src="image-only.html" title="Marketing Advert Image"></iframe>
      </div>
    </div>
  </div>
</body>
</html>''')

print("Generating B17: multi-link.pdf (PDF document with multiple embedded URI hyperlinks)...")
b17_path = os.path.join(OUT_DIR, 'multi-link.pdf')
b17_pages = [
    [
        "### APEX HORIZON BANK & TRUST - MULTI-URL DISCLOSURE DIRECTORY",
        "Apex Horizon Bank N.A. • Member FDIC • Equal Housing Lender • NMLS #491022",
        "Document Ref: MULTI-URL-099-2026 • Statutory Multi-Resource Index",
        "",
        "## 1. Federal Regulatory & Statutory Authority Links",
        "Please visit the following official regulatory portals for statutory provisions:",
        "  • CFPB Truth in Lending (Reg Z): https://www.consumerfinance.gov/rules-policy/regulations/1026/",
        "  • FDIC Deposit Insurance Information: https://www.fdic.gov/resources/deposit-insurance/",
        "  • NMLS Consumer Access Directory: https://www.nmlsconsumeraccess.org",
        "",
        "## 2. Program Disclosures & Additional Schedules",
        "For additional program details, access the supplementary documents below:",
        "  • Primary Rate Disclosure: disclosure-text.pdf",
        "  • Full Master Fee Schedule: disclosure-large.pdf",
        "",
        "## 3. Official Compliance Notice",
        "All hyperlinked regulatory resources are maintained in accordance with federal consumer protection mandates."
    ]
]
b17_annots = [
    {'page': 0, 'rect': [54, 580, 500, 600], 'url': 'https://www.consumerfinance.gov/rules-policy/regulations/1026/'},
    {'page': 0, 'rect': [54, 560, 500, 580], 'url': 'https://www.fdic.gov/resources/deposit-insurance/'},
    {'page': 0, 'rect': [54, 540, 500, 560], 'url': 'https://www.nmlsconsumeraccess.org'},
    {'page': 0, 'rect': [54, 460, 350, 480], 'url': 'disclosure-text.pdf'},
    {'page': 0, 'rect': [54, 440, 350, 460], 'url': 'disclosure-large.pdf'},
]
create_text_pdf(b17_pages, b17_path, link_annotations=b17_annots)

print("All 17 B-series files generated successfully in public/files/llm-4188!")

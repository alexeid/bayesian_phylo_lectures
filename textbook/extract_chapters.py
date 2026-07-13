#!/usr/bin/env python3
"""Extract chapter text from Decoding Genomes PDF using pypdf."""

import re
from pathlib import Path
from pypdf import PdfReader

PDF_PATH = Path(__file__).parent / "Decoding_Genomes_ed1_ebook.pdf"
OUT_DIR = Path(__file__).parent / "chapters"
OUT_DIR.mkdir(exist_ok=True)

reader = PdfReader(PDF_PATH)
print(f"Total pages: {len(reader.pages)}")

# First pass: extract all page text and identify chapter boundaries
pages_text = []
for i, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    pages_text.append(text)

# Print PDF outline / bookmarks if available
def print_outline(outline, level=0):
    results = []
    for item in outline:
        if isinstance(item, list):
            results.extend(print_outline(item, level + 1))
        else:
            page_num = reader.get_destination_page_number(item)
            results.append((level, item.title, page_num))
            print(f"{'  ' * level}{item.title} -> page {page_num}")
    return results

print("\n=== PDF Outline ===")
outline_items = []
if reader.outline:
    outline_items = print_outline(reader.outline)
else:
    print("No outline/bookmarks found")

# Identify chapter boundaries by scanning for chapter headings
print("\n=== Scanning for chapter headings ===")
chapter_starts = []
for i, text in enumerate(pages_text):
    # Look for lines that start with "Chapter" or numbered chapter patterns
    lines = text.split('\n')
    for line in lines[:5]:  # Check first few lines of each page
        stripped = line.strip()
        if re.match(r'^Chapter\s+\d+', stripped, re.IGNORECASE):
            print(f"  Page {i}: {stripped[:80]}")
            chapter_starts.append((i, stripped))
        elif re.match(r'^\d+\s+[A-Z]', stripped) and len(stripped) > 5:
            # Could be "5 Substitution Models" style
            pass

# Also look for chapter patterns in outline
chapter_outline = []
for level, title, page_num in outline_items:
    if level == 0 or re.match(r'^(Chapter\s+)?\d+[\s.]', title):
        chapter_outline.append((page_num, title))

# Use outline-based chapters if available, otherwise use scan results
if chapter_outline:
    print("\n=== Using outline-based chapter boundaries ===")
    chapters = chapter_outline
else:
    print("\n=== Using scan-based chapter boundaries ===")
    chapters = chapter_starts

for page_num, title in chapters:
    print(f"  Page {page_num}: {title}")

# Extract text for each chapter
print("\n=== Extracting chapters ===")
for idx in range(len(chapters)):
    start_page = chapters[idx][0]
    title = chapters[idx][1]

    if idx + 1 < len(chapters):
        end_page = chapters[idx + 1][0]
    else:
        end_page = len(pages_text)

    chapter_text = "\n\n--- PAGE BREAK ---\n\n".join(
        pages_text[start_page:end_page]
    )

    # Create a safe filename
    safe_title = re.sub(r'[^\w\s-]', '', title).strip()
    safe_title = re.sub(r'\s+', '_', safe_title)
    safe_title = safe_title[:60]

    # Try to extract chapter number
    ch_match = re.match(r'(?:Chapter\s+)?(\d+)', title)
    if ch_match:
        ch_num = ch_match.group(1)
        filename = f"ch{ch_num.zfill(2)}_{safe_title}.txt"
    else:
        filename = f"{safe_title}.txt"

    out_path = OUT_DIR / filename
    out_path.write_text(chapter_text, encoding='utf-8')
    print(f"  {filename} ({end_page - start_page} pages, {len(chapter_text)} chars)")

print("\nDone!")

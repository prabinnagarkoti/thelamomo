import zipfile
import xml.etree.ElementTree as ET
import re

def extract_text(zip_path, out_path):
    with zipfile.ZipFile(zip_path, 'r') as z:
        slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
        
        def get_slide_num(filename):
            match = re.search(r'slide(\d+)\.xml', filename)
            return int(match.group(1)) if match else 0
            
        slides.sort(key=get_slide_num)
        
        with open(out_path, 'w', encoding='utf-8') as out_f:
            for slide_file in slides:
                out_f.write(f"\n========== {slide_file} ==========\n")
                xml_content = z.read(slide_file)
                root = ET.fromstring(xml_content)
                
                texts = []
                for node in root.iter():
                    if node.tag.endswith('}t') and node.text:
                        texts.append(node.text)
                
                out_f.write(" ".join(texts) + "\n")
            
extract_text(r"C:\Users\PRABIN\Downloads\G5_INF305_A2.pptx", r"C:\Users\PRABIN\Desktop\thelamomo\ppt_content.txt")

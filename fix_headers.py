import os

files_to_clean = [
    "lib/auth_service.dart",
    "lib/map_picker_screen.dart",
    "lib/dump_report_screen.dart",
    "lib/login_screen.dart",
    "lib/reg_screen.dart",
    "lib/config.dart"
]

for filepath in files_to_clean:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "rb") as f:
        data = f.read()
    
    # decode with ignore
    text = data.decode("utf-8", errors="ignore")
    
    # Find the start of the code
    idx_import = text.find("import ")
    idx_class = text.find("class ")
    idx_const = text.find("const ")
    
    possible_starts = [i for i in [idx_import, idx_class, idx_const] if i != -1]
    if possible_starts:
        start_idx = min(possible_starts)
        text = text[start_idx:]
    
    # For auth_service.dart, also remove comments
    if "auth_service.dart" in filepath:
        lines = text.split('\n')
        new_lines = []
        for line in lines:
            stripped = line.lstrip()
            if stripped.startswith("//"):
                continue
            if "//" in line:
                parts = line.split("//")
                new_line = parts[0].rstrip()
                if new_line.strip() or not stripped: # keep if it has code, or if it was empty anyway
                    new_lines.append(new_line)
            else:
                new_lines.append(line)
        text = '\n'.join(new_lines)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(text)


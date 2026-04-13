import re
import json

html_file = r"c:\Users\Nishant Raushan\Downloads\60_Day_Placement_Roadmap.html"
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the days array in the JS script
pattern = re.compile(r"const days = \[\s*(.*?)\s*\];", re.DOTALL)
match = pattern.search(content)

if match:
    days_js = match.group(1)
    
    # We need to parse a JS object array, which is basically JSON but properties might not be quoted, and there are comments like // WEEK 1
    # Actually, the JS object keys are unquoted: { d:1, title:"...", ... }
    # Let's fix this for json.loads
    # Remove lines with comments
    days_js = re.sub(r"//.*", "", days_js)
    # Quote the keys (d, title, week, dsa, ml, dev, deploy)
    days_js = re.sub(r'(\b\w+\b):', r'"\1":', days_js)
    # It might have trailing commas in objects or array lists, but python eval can handle dicts if we are careful, 
    # but let's try json loads after replacing single quotes with double quotes? No, the JS uses double quotes for values mostly, but there are some single quotes?
    # Actually python's ast.literal_eval is safer if we just translate to dicts, but JS 'title' doesn't exist.
    
    # Let's try Pythons eval with a custom dict locally since it's highly python-dict compatible (just unquoted keys).
    # Wait, the keys are fixed. Let's just use regex to clean it safely.
    # An easier way is just to write a small node.js script because the system might have node installed, or use python's chomp.
    
    import ast
    # replace unquoted keys with quoted ones:
    clean_str = ""
    for line in days_js.split('\n'):
        if line.strip().startswith('//'): continue
        if line.strip() == "": continue
        # use regex to quote keys
        line = re.sub(r'([{,]\s*)([a-zA-Z_]\w*)(\s*:)', r'\1"\2"\3', line)
        clean_str += line + "\n"
    
    # The clean_str might still have syntax issues for pure JSON (trailing commas, single quotes instead of double).
    # Let's write the clean_str and let a node script properly stringify it, or just do it in python by converting single to double quotes (tricky since string content might have single quotes).
    pass
else:
    print("Failed to find 'const days = [' array")

with open(r"c:\Users\Nishant Raushan\.gemini\antigravity\scratch\extract.js", "w", encoding="utf-8") as f:
    f.write(f"""const fs = require('fs');
const content = fs.readFileSync('{html_file.replace("\\\", "\\\\")}', 'utf8');
const match = content.match(/const days = \\\\[([\\\\s\\\\S]*?)\\\\];/);
if (match) {{
    // Extract everything between the brackets
    const jsArray = eval('[' + match[1] + ']');
    fs.writeFileSync('c:\\\\Users\\\\Nishant Raushan\\\\.gemini\\\\antigravity\\\\scratch\\\\roadmap.json', JSON.stringify(jsArray, null, 2));
    console.log("Successfully extracted to roadmap.json");
}} else {{
    console.log("Failed to match regex in Node");
}}
""")


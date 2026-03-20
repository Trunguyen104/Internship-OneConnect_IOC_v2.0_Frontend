import json

def read_json_file(filename):
    for encoding in ['utf-8', 'utf-16', 'utf-16-le', 'utf-16-be', 'utf-8-sig']:
        try:
            with open(filename, 'r', encoding=encoding) as f:
                return json.load(f)
        except Exception:
            continue
    return None

data = read_json_file('clean_v2.json')
if data:
    for file_data in data:
        filename = file_data['filePath']
        messages = [m for m in file_data['messages'] if m.get('ruleId') == 'react/jsx-no-literals']
        if messages:
            print(f"\nFILE: {filename}")
            for m in messages:
                print(f"  Line {m['line']}: {m['message']}")
else:
    print("Failed to read JSON")

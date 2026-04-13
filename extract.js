const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Nishant Raushan\\Downloads\\60_Day_Placement_Roadmap.html', 'utf8');
const match = content.match(/const days = \[([\s\S]*?)\];/);
if (match) {
    const jsArray = eval('[' + match[1] + ']');
    fs.writeFileSync('c:\\Users\\Nishant Raushan\\.gemini\\antigravity\\brain\\2f950796-30e1-48ab-9748-12b07335aa2e\\roadmap.json', JSON.stringify(jsArray, null, 2));
    console.log("Successfully extracted to roadmap.json");
} else {
    console.log("Failed to match regex in HTML");
}

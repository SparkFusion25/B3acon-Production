const fs = require('fs');

// Add supabase null check before specific lines
const files = [
  {
    file: 'src/components/Client/ClientSupport.tsx',
    fixes: [
      { line: 'const handleCreateTicket = async (e: React.FormEvent) => {', add: '    if (!supabase) {\n      throw new Error(\'Supabase not configured\');\n    }' },
      { line: 'const handleSendMessage = async (e: React.FormEvent) => {', add: '    if (!supabase) {\n      throw new Error(\'Supabase not configured\');\n    }' },
      { line: 'const handleReopenTicket = async (ticketId: string) => {', add: '    if (!supabase) {\n      throw new Error(\'Supabase not configured\');\n    }' }
    ]
  }
];

files.forEach(({file, fixes}) => {
  let content = fs.readFileSync(file, 'utf8');
  fixes.forEach(({line, add}) => {
    const lines = content.split('\n');
    for(let i = 0; i < lines.length; i++) {
      if(lines[i].includes(line)) {
        lines.splice(i + 1, 0, add);
        break;
      }
    }
    content = lines.join('\n');
  });
  fs.writeFileSync(file, content);
});

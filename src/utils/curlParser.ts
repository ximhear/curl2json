export interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
}

export function parseCurlCommand(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    url: '',
    method: 'GET',
    headers: {}
  };

  // Normalize multiline commands by removing backslashes and extra whitespace
  const normalized = curlCommand
    .replace(/\\\s*\n\s*/g, ' ') // Remove backslash line continuations
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (!normalized.startsWith('curl')) {
    throw new Error('Command must start with "curl"');
  }

  const args = parseShellArgs(normalized);
  console.log('Parsed args:', args); // Debug log
  
  let skipNext = false;
  
  for (let i = 1; i < args.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    
    const arg = args[i];
    
    if (arg === '-X' || arg === '--request') {
      result.method = args[++i]?.toUpperCase() || 'GET';
    } else if (arg === '-H' || arg === '--header') {
      const headerString = args[++i];
      if (headerString) {
        const [key, ...valueParts] = headerString.split(':');
        if (key && valueParts.length > 0) {
          result.headers[key.trim()] = valueParts.join(':').trim();
        }
      }
    } else if (arg === '-d' || arg === '--data' || arg === '--data-raw') {
      const dataValue = args[++i];
      // Only set data if it's not empty string
      if (dataValue && dataValue !== '') {
        result.data = dataValue;
      }
      // Don't change method from GET to POST for empty -d flag
    } else if (!arg.startsWith('-')) {
      // This is likely the URL since it doesn't start with -
      result.url = arg;
    }
  }

  // If we still don't have URL, look for the last argument that looks like a URL
  if (!result.url) {
    for (let i = args.length - 1; i >= 1; i--) {
      const arg = args[i];
      if (!arg.startsWith('-') && (arg.includes('://') || arg.startsWith('/'))) {
        result.url = arg;
        break;
      }
    }
  }

  if (!result.url) {
    console.error('Failed to find URL in args:', args);
    throw new Error('No URL found in curl command');
  }

  console.log('Final parsed result:', result); // Debug log
  return result;
}

function parseShellArgs(command: string): string[] {
  const args: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  let escaped = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
      continue;
    }

    if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = '';
      continue;
    }

    if (!inQuotes && char === ' ') {
      if (current) {
        args.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current) {
    args.push(current);
  }

  return args;
}
/**
 * SMART NUMBER PARSER
 * Parse numbers dengan format Indonesia dan International
 * 
 * Format Indonesia: 1.165.992 (titik = separator ribuan)
 * Format International: 1,165,992.50 (koma = separator ribuan, titik = decimal)
 */

export function parseSmartNumber(value: any, context?: string): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  // Convert to string
  let str = String(value).trim();
  const originalStr = str; // Store original for logging
  
  // 🔴 CRITICAL FIX: For QUANTITY, use SIMPLE INTEGER PARSING!
  // Quantity should NEVER have decimals or thousand separators!
  if (context === 'quantity') {
    // Remove EVERYTHING except digits - NO DOTS, NO COMMAS!
    const cleanQty = str.replace(/[^\d]/g, '');
    
    // Handle empty string after cleaning
    if (!cleanQty) {
      console.warn(`⚠️ Invalid quantity: "${originalStr}" (no digits) → defaulting to 0`);
      return 0;
    }
    
    const result = parseInt(cleanQty, 10);
    
    if (isNaN(result) || result < 0) {
      console.warn(`⚠️ Invalid quantity: "${originalStr}" → defaulting to 0`);
      return 0;
    }
    
    // 🔴 CRITICAL: Quantity should be VERY SMALL (1-100 typically)
    if (result > 1000) {
      console.error(`❌❌❌ QUANTITY SUSPICIOUSLY LARGE!`);
      console.error(`   Input: "${originalStr}" → Parsed: ${result}`);
      console.error(`   Expected: Small number (1-100), got: ${result}`);
      console.error(`   This suggests WRONG COLUMN or PARSING ERROR!`);
    }
    
    // Log successful parsing for debugging
    if (result > 0 && result <= 100) {
      console.log(`✅ Quantity parsed: "${originalStr}" → ${result} units`);
    }
    
    return result;
  }
  
  // For PRICE and REVENUE, use smart parsing
  
  // Remove currency symbols
  str = str.replace(/[Rp$€£¥₹]/gi, '').trim();
  
  // Count dots and commas to determine format
  const dotCount = (str.match(/\./g) || []).length;
  const commaCount = (str.match(/,/g) || []).length;
  
  // Determine format based on patterns
  let cleanStr: string;
  
  if (dotCount > 1 && commaCount === 0) {
    // Format Indonesia: 1.165.992 (multiple dots, no comma)
    // Remove all dots (they are thousand separators)
    cleanStr = str.replace(/\./g, '');
  } else if (commaCount > 1 && dotCount === 0) {
    // Format: 1,165,992 (multiple commas, no dot)
    // Remove all commas (they are thousand separators)
    cleanStr = str.replace(/,/g, '');
  } else if (dotCount === 1 && commaCount >= 1) {
    // Format International: 1,165,992.50
    // Remove commas, keep dot as decimal
    cleanStr = str.replace(/,/g, '');
  } else if (commaCount === 1 && dotCount >= 1) {
    // Format European: 1.165.992,50
    // Remove dots, replace comma with dot
    cleanStr = str.replace(/\./g, '').replace(/,/, '.');
  } else if (dotCount === 1 && commaCount === 0) {
    // Could be: 123.45 (decimal) or 123.456 (thousand separator)
    const parts = str.split('.');
    if (parts[1].length <= 2) {
      // Likely decimal: 123.45
      cleanStr = str;
    } else {
      // Likely thousand separator: 123.456
      cleanStr = str.replace(/\./g, '');
    }
  } else if (commaCount === 1 && dotCount === 0) {
    // Could be: 123,45 (European decimal) or 123,456 (thousand separator)
    const parts = str.split(',');
    if (parts[1].length <= 2) {
      // Likely decimal: 123,45
      cleanStr = str.replace(/,/, '.');
    } else {
      // Likely thousand separator: 123,456
      cleanStr = str.replace(/,/g, '');
    }
  } else {
    // No dots or commas, just parse
    cleanStr = str;
  }
  
  // Remove any remaining non-numeric characters except decimal point and minus
  cleanStr = cleanStr.replace(/[^\d.-]/g, '');
  
  const result = parseFloat(cleanStr);
  
  return isNaN(result) ? 0 : result;
}

/**
 * Test cases
 */
export function testNumberParser() {
  const tests = [
    { input: '1.165.992', expected: 1165992 },
    { input: '544.160', expected: 544160 },
    { input: '1,165,992', expected: 1165992 },
    { input: '1,165,992.50', expected: 1165992.50 },
    { input: '1.165.992,50', expected: 1165992.50 },
    { input: '123.45', expected: 123.45 },
    { input: '123,45', expected: 123.45 },
    { input: '1234567', expected: 1234567 },
    { input: 'Rp 1.165.992', expected: 1165992 },
    { input: '$1,165,992.50', expected: 1165992.50 },
  ];
  
  console.log('=== Number Parser Tests ===');
  tests.forEach(test => {
    const result = parseSmartNumber(test.input);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} "${test.input}" → ${result} (expected: ${test.expected})`);
  });
}

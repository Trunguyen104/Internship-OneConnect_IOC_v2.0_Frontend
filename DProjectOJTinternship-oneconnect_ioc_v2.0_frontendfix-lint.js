const fs = require('fs');
const path = require('path');

// Files to fix with their string mappings
const fixes = [
  {
    file: 'src/components/features/universities/UniversitiesPage.jsx',
    replacements: [
      { search: '"Communication Error"', replace: 'UI_TEXT.COMMON.COMMUNICATION_ERROR' },
      { search: '"Try Again"', replace: 'UI_TEXT.COMMON.TRY_AGAIN' }
    ],
    imports: ['import { UI_TEXT } from \'@/lib/UI_Text\';']
  },
  {
    file: 'src/components/features/universities/UniversitiesTable.jsx',
    replacements: [
      { search: '"Code"', replace: 'UI_TEXT.COMMON.CODE' },
      { search: '"University"', replace: 'UI_TEXT.COMMON.UNIVERSITY' },
      { search: '"Address"', replace: 'UI_TEXT.COMMON.ADDRESS' },
      { search: '"Action"', replace: 'UI_TEXT.COMMON.ACTION' }
    ],
    imports: ['import { UI_TEXT } from \'@/lib/UI_Text\';']
  }
];

console.log('Script loaded. Fix files manually using ESLint --fix with ESLINT_FIX_TIMEOUT');

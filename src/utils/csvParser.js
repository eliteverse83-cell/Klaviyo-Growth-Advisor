/**
 * Minimal RFC4180-ish CSV parser: handles quoted fields, embedded commas,
 * embedded newlines, and escaped ("") quotes. No external dependency.
 */
export function parseCsv(text) {
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0
  const len = input.length

  while (i < len) {
    const char = input[i]

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      field += char
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      i += 1
      continue
    }
    if (char === '\r') {
      i += 1
      continue
    }
    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i += 1
      continue
    }
    field += char
    i += 1
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((r) => !(r.length === 1 && r[0].trim() === ''))
  if (nonEmptyRows.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = nonEmptyRows[0].map((h) => h.trim())
  const rowObjects = nonEmptyRows.slice(1).map((r) => {
    const obj = {}
    headers.forEach((header, index) => {
      obj[header] = (r[index] ?? '').trim()
    })
    return obj
  })

  return { headers, rows: rowObjects }
}

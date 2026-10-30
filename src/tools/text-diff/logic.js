// Pure logic only: no React, no DOM. Easy to test, easy for a worker to get right.

// Split a string into lines. An empty string yields zero lines.
function splitLines(text) {
  if (text === '') return []
  return text.split(/\r?\n/)
}

// Compute a line-by-line diff using an LCS (longest common subsequence) table.
// Where lines differ, all 'remove' entries are emitted before the 'add' entries
// of the same change.
export function diffLines(a, b) {
  const linesA = splitLines(a)
  const linesB = splitLines(b)
  const n = linesA.length
  const m = linesB.length

  // LCS table: dp[i][j] = length of LCS of linesA[i:] and linesB[j:]
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (linesA[i] === linesB[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
  }

  const result = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: 'same', text: linesA[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'remove', text: linesA[i] })
      i++
    } else {
      result.push({ type: 'add', text: linesB[j] })
      j++
    }
  }
  while (i < n) {
    result.push({ type: 'remove', text: linesA[i] })
    i++
  }
  while (j < m) {
    result.push({ type: 'add', text: linesB[j] })
    j++
  }

  // Reorder so that within each contiguous block of non-same entries,
  // all 'remove' entries come before all 'add' entries.
  const reordered = []
  let idx = 0
  while (idx < result.length) {
    if (result[idx].type === 'same') {
      reordered.push(result[idx])
      idx++
    } else {
      const block = []
      while (idx < result.length && result[idx].type !== 'same') {
        block.push(result[idx])
        idx++
      }
      const removes = block.filter((e) => e.type === 'remove')
      const adds = block.filter((e) => e.type === 'add')
      reordered.push(...removes, ...adds)
    }
  }
  return reordered
}

// Count how many entries of each type are in a diff.
export function diffStats(diff) {
  let added = 0
  let removed = 0
  let same = 0
  for (const entry of diff) {
    if (entry.type === 'add') added++
    else if (entry.type === 'remove') removed++
    else same++
  }
  return { added, removed, same }
}

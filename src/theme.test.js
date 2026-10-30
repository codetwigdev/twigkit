import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_KEY, applyTheme, getTheme, nextTheme, setTheme } from './theme.js'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme', () => {
  it('uses the key twigkit-theme', () => {
    expect(THEME_KEY).toBe('twigkit-theme')
  })

  it('cycles auto -> light -> dark -> auto', () => {
    expect(nextTheme('auto')).toBe('light')
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('auto')
  })

  it('defaults to auto and ignores garbage in storage', () => {
    expect(getTheme()).toBe('auto')
    localStorage.setItem(THEME_KEY, 'purple')
    expect(getTheme()).toBe('auto')
  })

  it('applies light and dark as data-theme and removes it for auto', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('auto')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('setTheme persists, applies and announces the change', () => {
    const heard = vi.fn()
    window.addEventListener('twigkit:theme', (e) => heard(e.detail))

    setTheme('dark')
    expect(localStorage.getItem(THEME_KEY)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(getTheme()).toBe('dark')
    expect(heard).toHaveBeenCalledWith('dark')

    setTheme('auto')
    expect(localStorage.getItem(THEME_KEY)).toBeNull()
    expect(document.documentElement.dataset.theme).toBeUndefined()
    expect(heard).toHaveBeenLastCalledWith('auto')
  })
})

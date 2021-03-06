// @flow
import hslToRgb from '../internalHelpers/_hslToRgb'
import nameToHex from '../internalHelpers/_nameToHex'
import type { RgbColor, RgbaColor } from '../types/color'

const hexRegex = /^#[a-fA-F0-9]{6}$/
const reducedHexRegex = /^#[a-fA-F0-9]{3}$/
const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/
const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/
const hslaRegex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([-+]?[0-9]*[.]?[0-9]+)\s*\)$/

/**
 * Returns an RgbColor or RgbaColor object. This utility function is only useful
 * if want to extract a color component. With the color util `toColorString` you
 * can convert a RgbColor or RgbaColor object back to a string.
 *
 * @example
 * // Assigns `{ red: 255, green: 0, blue: 0 }` to color1
 * const color1 = 'rgb(255, 0, 0)';
 * // Assigns `{ red: 92, green: 102, blue: 112, alpha: 0.75 }` to color2
 * const color2 = 'hsla(210, 10%, 40%, 0.75)';
 */
function parseToRgb(color: string): RgbColor | RgbaColor {
  if (typeof color !== 'string') {
    throw new Error(
      'Passed an incorrect argument to a color function, please pass a string representation of a color.',
    )
  }
  const normalizedColor = nameToHex(color)
  if (normalizedColor.match(hexRegex)) {
    return {
      red: parseInt(`${normalizedColor[1]}${normalizedColor[2]}`, 16),
      green: parseInt(`${normalizedColor[3]}${normalizedColor[4]}`, 16),
      blue: parseInt(`${normalizedColor[5]}${normalizedColor[6]}`, 16),
    }
  }
  if (normalizedColor.match(reducedHexRegex)) {
    return {
      red: parseInt(`${normalizedColor[1]}${normalizedColor[1]}`, 16),
      green: parseInt(`${normalizedColor[2]}${normalizedColor[2]}`, 16),
      blue: parseInt(`${normalizedColor[3]}${normalizedColor[3]}`, 16),
    }
  }
  const rgbMatched = rgbRegex.exec(normalizedColor)
  if (rgbMatched) {
    return {
      red: parseInt(`${rgbMatched[1]}`, 10),
      green: parseInt(`${rgbMatched[2]}`, 10),
      blue: parseInt(`${rgbMatched[3]}`, 10),
    }
  }
  const rgbaMatched = rgbaRegex.exec(normalizedColor)
  if (rgbaMatched) {
    return {
      red: parseInt(`${rgbaMatched[1]}`, 10),
      green: parseInt(`${rgbaMatched[2]}`, 10),
      blue: parseInt(`${rgbaMatched[3]}`, 10),
      alpha: parseFloat(`${rgbaMatched[4]}`),
    }
  }
  const hslMatched = hslRegex.exec(normalizedColor)
  if (hslMatched) {
    const hue = parseInt(`${hslMatched[1]}`, 10)
    const saturation = parseInt(`${hslMatched[2]}`, 10) / 100
    const lightness = parseInt(`${hslMatched[3]}`, 10) / 100
    const rgbColorString = `rgb(${hslToRgb(hue, saturation, lightness)})`
    const hslRgbMatched = rgbRegex.exec(rgbColorString)
    return {
      red: parseInt(`${hslRgbMatched[1]}`, 10),
      green: parseInt(`${hslRgbMatched[2]}`, 10),
      blue: parseInt(`${hslRgbMatched[3]}`, 10),
    }
  }
  const hslaMatched = hslaRegex.exec(normalizedColor)
  if (hslaMatched) {
    const hue = parseInt(`${hslaMatched[1]}`, 10)
    const saturation = parseInt(`${hslaMatched[2]}`, 10) / 100
    const lightness = parseInt(`${hslaMatched[3]}`, 10) / 100
    const rgbColorString = `rgb(${hslToRgb(hue, saturation, lightness)})`
    const hslRgbMatched = rgbRegex.exec(rgbColorString)
    return {
      red: parseInt(`${hslRgbMatched[1]}`, 10),
      green: parseInt(`${hslRgbMatched[2]}`, 10),
      blue: parseInt(`${hslRgbMatched[3]}`, 10),
      alpha: parseFloat(`${hslaMatched[4]}`),
    }
  }
  throw new Error(
    "Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.",
  )
}

export default parseToRgb

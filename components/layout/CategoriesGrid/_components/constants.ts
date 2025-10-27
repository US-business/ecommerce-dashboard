// Grid columns configuration
export const GRID_COLS = {
    2: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
} as const

// أشكال مختلفة للـ border-radius لكل فئة
export const RADIUS_SHAPES = [
    "37% 63% 63% 37% / 57% 55% 45% 43%",
    "25% 75% 39% 61% / 72% 37% 63% 28%",
    "58% 42% 39% 61% / 29% 42% 58% 71%",
    "58% 42% 73% 27% / 29% 63% 37% 71%",
    "43% 57% 35% 65% / 48% 62% 38% 52%",
    "63% 37% 54% 46% / 55% 48% 52% 45%"
] as const

export const getColorClassName = (
  color: string,
  type: 'bg' | 'text' | 'fill' | 'stroke',
) => {
  return `${type}-${color}`;
};

export const AvailableChartColors = [
  'primary-500',
  'slate-200',
  'gray-500',
  'blue-500',
  'danger-500',
  'success-500',
] as const;

export type AvailableChartColorsKeys = (typeof AvailableChartColors)[number];

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
) => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

---
inclusion: always
---

# Color System Guidelines

## Primary Color Palette

This project uses a neutral-based design system with CSS custom properties for theming. Follow these color conventions:

### Core Colors

- **Primary**: Use `primary` and `primary-foreground` for main brand elements
- **Secondary**: Use `secondary` and `secondary-foreground` for supporting elements
- **Accent**: Use `accent` and `accent-foreground` for highlights and interactive states

### Semantic Colors

- **Destructive**: Use `destructive` for error states and dangerous actions
- **Muted**: Use `muted` and `muted-foreground` for subtle text and backgrounds
- **Border**: Use `border` for dividers and component outlines

### Component-Specific Colors

- **Card**: Use `card` and `card-foreground` for card components
- **Popover**: Use `popover` and `popover-foreground` for overlay content
- **Sidebar**: Use sidebar color variants for navigation components

## Implementation Rules

1. **Always use CSS custom properties** instead of hardcoded colors (e.g., `bg-primary` not `bg-blue-500`)
2. **Maintain dark mode compatibility** - all colors have automatic dark mode variants
3. **Use semantic naming** - choose colors based on purpose, not appearance
4. **Leverage Tailwind classes** that map to the custom properties (e.g., `text-foreground`, `bg-card`)
5. **For transparency effects**, use the established patterns like `bg-black/20` or `bg-white/10`

## Chart Colors

For data visualization, use the predefined chart color variables (`chart-1` through `chart-5`) to maintain consistency across charts and graphs.

# Icon Setup Guide

## 🎯 Using Your Own Icons

Your icon browser now uses local SVG files instead of lucide-react. Here's how to customize it with your own icons:

### 📁 Current UI Icons Location

All UI icons are stored in: `public/icons/ui/`

Current icons:

- `search.svg` - Search icon in search bar
- `x.svg` - Close/clear buttons
- `filter.svg` - Filter icon (currently unused)
- `chevron-down.svg` - Dropdown arrows
- `download.svg` - Download buttons
- `eye.svg` - Preview/view buttons
- `copy.svg` - Copy buttons
- `check.svg` - Success/checkmark icons
- `external-link.svg` - External link icon (currently unused)

### 🔄 How to Replace Icons

1. **Replace UI Icons**: Simply replace the SVG files in `public/icons/ui/` with your own
2. **Keep Same Names**: Make sure to keep the same filenames so the app can find them
3. **SVG Format**: Use SVG format for best results (scalable and lightweight)

### 📊 Adding Your Icon Collection

To add your actual icon collection:

1. **Create Directory Structure**:

   ```
   public/icons/
   ├── ui/           # UI icons (search, close, etc.)
   ├── navigation/   # Navigation icons
   ├── user/         # User-related icons
   ├── system/       # System icons
   ├── action/       # Action icons
   ├── social/       # Social icons
   ├── ecommerce/    # E-commerce icons
   ├── communication/# Communication icons
   ├── time/         # Time/scheduling icons
   └── rating/       # Rating icons
   ```

2. **Update Icon Data**: Modify `src/data/sample-icons.ts` to include your actual icons:

   ```typescript
   export const sampleIcons: Icon[] = [
     {
       id: "1",
       name: "Your Icon Name",
       filename: "your-icon.svg",
       format: "svg",
       category: "Your Category",
       tags: ["tag1", "tag2"],
       synonyms: ["synonym1", "synonym2"],
       filePath: "/icons/your-category/your-icon.svg",
       size: { width: 24, height: 24 },
       description: "Your icon description",
     },
     // ... more icons
   ];
   ```

3. **Update File Paths**: Make sure the `filePath` property matches your actual file structure

### 🎨 Icon Requirements

- **Format**: SVG preferred, PNG/JPG also supported
- **Size**: Any size (will be displayed at 24x24px in the grid)
- **Style**: Consistent style recommended for best visual results
- **Naming**: Use descriptive filenames

### 🚀 Next Steps

1. Replace the UI icons in `public/icons/ui/` with your own
2. Add your icon collection to the appropriate directories
3. Update the icon data in `src/data/sample-icons.ts`
4. Test the search and filtering with your actual icons

The app will automatically pick up your icons and display them in the beautiful interface!

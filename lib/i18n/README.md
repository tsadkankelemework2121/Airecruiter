# Internationalization (i18n) Guide

## How to Use Translations

### 1. Import the hook in your component:
```tsx
import { useI18n } from "@/lib/i18n/context";
```

### 2. Use translations in your component:
```tsx
function MyComponent() {
  const { t } = useI18n();
  
  return <div>{t.nav.home}</div>;
}
```

### 3. Switch languages:
The language switcher is automatically available in the Navbar. Users can toggle between English (EN) and Amharic (AM).

## Translation Keys Available

All translation keys are organized by category:
- `t.nav.*` - Navigation links
- `t.common.*` - Common actions (save, cancel, delete, etc.)
- `t.auth.*` - Authentication related
- `t.dashboard.*` - Dashboard sections
- `t.jobs.*` - Job related
- `t.applications.*` - Application related
- `t.screening.*` - AI Screening related
- `t.profile.*` - Profile related
- `t.home.*` - Home page content
- `t.messages.*` - Success/error messages

## Adding New Translations

To add new translations:

1. Add the key to the `Translations` interface in `lib/i18n/translations.ts`
2. Add English translation in `translations.en`
3. Add Amharic translation in `translations.am`

Example:
```typescript
// In interface
newSection: {
  title: string;
  subtitle: string;
}

// In translations.en
newSection: {
  title: "New Section",
  subtitle: "Description here",
}

// In translations.am
newSection: {
  title: "አዲስ ክፍል",
  subtitle: "መግለጫ እዚህ",
}
```




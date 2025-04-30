import { Platform, PlatformColor } from 'react-native';

export type ColorsObj = {
  primaryTextColor: ReturnType<typeof PlatformColor>;
  secondaryTextColor: ReturnType<typeof PlatformColor>;
  primaryBackgroundColor: ReturnType<typeof PlatformColor>;
  secondaryBackgroundColor: ReturnType<typeof PlatformColor>;
  accentColor: ReturnType<typeof PlatformColor>;
  primaryBorderColor: ReturnType<typeof PlatformColor>;
  secondaryBorderColor: ReturnType<typeof PlatformColor>;
};

export const getSystemColors = (): ColorsObj => {
  if (Platform.OS === 'ios') {
    return {
      primaryTextColor: PlatformColor('label'),
      secondaryTextColor: PlatformColor('secondaryLabel'),
      primaryBackgroundColor: PlatformColor('systemBackground'),
      secondaryBackgroundColor: PlatformColor('secondarySystemBackground'),
      // Use the system's tintColor to reference the runtime provided accent color
      accentColor: PlatformColor('tintColor'),
      primaryBorderColor: PlatformColor('separator'),
      secondaryBorderColor: PlatformColor('quaternaryLabel')
    };
  }
  return {
    primaryTextColor: PlatformColor('@android:color/primary_text_dark'),
    secondaryTextColor: PlatformColor('@android:color/secondary_text_dark'),
    primaryBackgroundColor: PlatformColor('@android:color/background_light'),
    secondaryBackgroundColor: PlatformColor('@android:color/background_light'),
    // Use Android's runtime provided accent color from the theme attribute
    accentColor: PlatformColor('@android:color/colorAccent'),
    // These are examples of accent-related backgrounds; adjust as needed.
    primaryBorderColor: PlatformColor('@android:color/darker_gray'),
    secondaryBorderColor: PlatformColor('@android:color/medium_gray')
  };
};
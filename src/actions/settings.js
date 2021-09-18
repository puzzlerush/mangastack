export const setTheme = (theme) => ({
  type: 'SET_THEME',
  theme,
});

export const setNSFW = (nsfw) => ({
  type: 'SET_NSFW',
  nsfw,
});

export const setLanguage = (language) => ({
  type: 'SET_LANGUAGE',
  language,
});

export const setUseLowResolution = (useLowResolution) => ({
  type: 'SET_USE_LOW_RESOLUTION',
  useLowResolution,
});

const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "jest-expo",
  transform: {
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: true,
        tsconfig: "tsconfig.spec.json",
        diagnostics: {
          // Exclude all diagnostic checks for files within specified expo packages
          exclude: [
            "**/node_modules/expo-modules-core/**",
            "**/node_modules/expo/**"
          ],
          // Keep specific ignores if they are for packages not covered by exclude, or as a fallback.
          // For now, TS7053 was for expo/src/Expo.fx.tsx, which will be covered by the exclude.
          // If other errors pop up from non-excluded paths, ignoreCodes can be used.
          // ignoreCodes: ["TS7053"],
        },
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleDirectories: ["node_modules", "<rootDir>/src/server"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|@react-navigation/.*|expo-router|@expo|expo(nent)?|expo-asset|expo-modules-core|expo-constants)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
  },
};

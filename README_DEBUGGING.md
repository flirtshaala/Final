# React Native 0.73 Debugging Guide

## New Hermes Debugging (Recommended)

React Native 0.73 introduces a new debugging experience with Hermes and the experimental debugger. The old remote JavaScript debugging is deprecated.

### Quick Start

1. **Start Metro with debugging enabled:**
   ```bash
   npm run dev-debug
   # or
   npm start
   ```

2. **Open the debugger:**
   - **Method 1:** Press `j` in the Metro terminal to open the debugger directly
   - **Method 2:** Open the in-app developer menu and select "Open Debugger"
     - Android Emulator: `Cmd+M` (Mac) or `Ctrl+M` (Windows/Linux)
     - iOS Simulator: `Cmd+D`
     - Physical Device: Shake the device

3. **The debugger will open in Chrome DevTools** with full support for:
   - Breakpoints
   - Step debugging
   - Variable inspection
   - Console logging
   - Network inspection
   - Performance profiling

### Available Scripts

- `npm start` - Start Metro with experimental debugger enabled
- `npm run dev-debug` - Start Metro with verbose logging and debugging
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator

### Debugging Features

#### Console Logging
```javascript
console.log('Debug message');
console.warn('Warning message');
console.error('Error message');
```

#### Breakpoints
Set breakpoints directly in Chrome DevTools or use `debugger;` statements in your code:
```javascript
function myFunction() {
  debugger; // Execution will pause here
  // Your code here
}
```

#### Network Debugging
The Network tab in Chrome DevTools will show all network requests made by your app, including:
- API calls
- Image loading
- WebSocket connections

### Troubleshooting

#### If the debugger doesn't open:
1. Make sure Metro is running with the `--experimental-debugger` flag
2. Check that your device/emulator can reach the Metro server
3. Try refreshing the app (`Cmd+R` or `Ctrl+R`)

#### Performance Issues:
- The new debugger runs in-process with Hermes, so it's much faster than the old remote debugging
- Source maps are automatically generated for better debugging experience

#### Flipper Alternative:
If you prefer Flipper for debugging, you can still use it alongside the new debugger:
1. Install Flipper desktop app
2. Enable Flipper in your app
3. Use both tools as needed

### Migration from Old Debugging

If you see the warning about deprecated remote JavaScript debugging:
- ✅ Use the new experimental debugger (this setup)
- ❌ Don't use "Debug JS Remotely" option
- ❌ Don't disable Hermes (unless absolutely necessary)

The new debugging experience is faster, more reliable, and provides better source map support.
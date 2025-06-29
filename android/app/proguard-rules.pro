# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Hermes specific rules
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.intl.** { *; }
-keep class com.facebook.hermes.inspector.** { *; }

# Keep source file names and line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep debugging information
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Keep JavaScript debugging interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# React Native Google Mobile Ads
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# Google Sign-In
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# Supabase
-keep class io.supabase.** { *; }
-dontwarn io.supabase.**

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Don't obfuscate classes used by React Native
-keep class com.flirtshaala.** { *; }

# Keep Hermes debugging classes
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# Preserve debugging symbols for Hermes
-keepnames class com.facebook.hermes.** { *; }
-keepnames class com.facebook.react.** { *; }

# React Native Image Picker
-keep class com.imagepicker.** { *; }
-dontwarn com.imagepicker.**

# React Native FS
-keep class com.rnfs.** { *; }
-dontwarn com.rnfs.**

# React Native Device Info
-keep class com.learnium.RNDeviceInfo.** { *; }
-dontwarn com.learnium.RNDeviceInfo.**

# React Native Permissions
-keep class com.zoontek.rnpermissions.** { *; }
-dontwarn com.zoontek.rnpermissions.**

# React Native Keychain
-keep class com.oblador.keychain.** { *; }
-dontwarn com.oblador.keychain.**

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# React Native SVG
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# React Native Splash Screen
-keep class org.devio.rn.splashscreen.** { *; }
-dontwarn org.devio.rn.splashscreen.**

# UUID
-keep class java.util.UUID { *; }

# Remove all logging in release builds
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Remove console.log statements
-assumenosideeffects class * {
    void console.log(...);
    void console.warn(...);
    void console.error(...);
    void console.info(...);
    void console.debug(...);
}
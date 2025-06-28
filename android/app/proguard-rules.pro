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

# Hermes specific rules for debugging
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

# Google Sign-In
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.** { *; }

# Supabase
-keep class io.supabase.** { *; }

# Don't obfuscate classes used by React Native
-keep class com.flirtshaala.** { *; }

# Keep Hermes debugging classes
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# Preserve debugging symbols for Hermes
-keepnames class com.facebook.hermes.** { *; }
-keepnames class com.facebook.react.** { *; }
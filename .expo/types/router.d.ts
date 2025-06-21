/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/account` | `/account`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/chat` | `/chat`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/history` | `/history`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/screenshot` | `/screenshot`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/account` | `/account`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/chat` | `/chat`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/history` | `/history`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/screenshot` | `/screenshot`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/account${`?${string}` | `#${string}` | ''}` | `/account${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/chat${`?${string}` | `#${string}` | ''}` | `/chat${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/history${`?${string}` | `#${string}` | ''}` | `/history${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/screenshot${`?${string}` | `#${string}` | ''}` | `/screenshot${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/account` | `/account`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/chat` | `/chat`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/history` | `/history`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/screenshot` | `/screenshot`; params?: Router.UnknownInputParams; };
    }
  }
}

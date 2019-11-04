declare module '*.svg'
declare module '*.png'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.jpg'
declare module '*.scss'

declare module 'reactComp/*'
declare module 'appDir/*'

declare namespace JSX {
  interface IntrinsicElements {
      [elemName: string]: any;
  }
}

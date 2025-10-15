// app/globals.d.ts หรือ types/globals.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
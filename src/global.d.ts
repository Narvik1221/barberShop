/// <reference types="vite/client" />
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.scss";
declare module "*.css";
declare module "*.svg" {
  const content: string;
  export default content;
}

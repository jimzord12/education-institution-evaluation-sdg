// types/componentType.ts
export type Component<Params = undefined> = {
  render: (params?: Params) => string;
};

// export type RouteParams = {
//   [key: string]: any;
// };

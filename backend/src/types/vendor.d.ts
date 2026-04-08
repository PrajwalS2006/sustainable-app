// Minimal module stubs so `tsc` can compile in a CommonJS + older resolution setup.
// Runtime uses the real packages installed in `node_modules`.

declare module 'morgan' {
  const morgan: any;
  export default morgan;
}

declare module 'zod' {
  export const z: any;
}

declare module 'ethers' {
  export const ethers: any;
}


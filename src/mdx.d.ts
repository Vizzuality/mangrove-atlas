declare module '*.mdx' {
  import { ComponentType } from 'react';

  // Define the default export as a React component
  const MDXComponent: ComponentType;

  // Export the component as default
  export default MDXComponent;

  // Allow for any additional exports from mdx files
  export const meta: Record<string, unknown>;
}

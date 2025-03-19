// This file defines a React functional component named `ReferenceLinks` which is used to display a list of reference links in the application.

// The component imports the `Link` component from `next/link` to create navigational links.
// It also imports `Fragment` and `FunctionComponent` from React to create the component and handle fragments.

// The `Props` interface defines the shape of the props that the `ReferenceLinks` component expects. It includes:
// - `items`: a string, an array of strings, an object with `href` and `name` properties, or an array of such objects.

// The `ReferenceLinks` component takes `items` as a prop and returns a JSX structure that represents the reference links. This structure includes:
// - If `items` is an array, it maps over the array and recursively renders `ReferenceLinks` for each item inside a `div` element with a unique key.
// - If `items` is a string or an object with `href` and `name` properties, it renders a `Link` component with the appropriate `href` and displays the link text.

// The `Link` component uses the `href` attribute to navigate to the specified URL and applies the `text-cyan-700 font-bold` classes for styling.

// Finally, the `ReferenceLinks` component is exported as the default export of the module.

import Link from "next/link";
import { Fragment, FunctionComponent } from "react";

interface Props {
  items:
    | string
    | string[]
    | { href: string; name: string }
    | { href: string; name: string }[];
}

const ReferenceLinks: FunctionComponent<Props> = ({ items }) => {
  if (Array.isArray(items)) {
    return (
      <Fragment>
        {items.map((item, index) => (
          <div key={index}>
            <ReferenceLinks items={item} />
          </div>
        ))}
      </Fragment>
    );
  }

  return (
    <Link
      href={typeof items === "string" ? items : items.href}
      className="text-cyan-700 font-bold"
    >
      {typeof items === "string" ? items : items.name}
    </Link>
  );
};
export default ReferenceLinks;

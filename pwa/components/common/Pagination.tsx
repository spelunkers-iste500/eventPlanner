// This file defines a React functional component named `Pagination` which is used to display pagination controls for navigating through a paginated collection of items.

// The component imports the `Link` component from `next/link` to create navigational links.
// It also imports the `PagedCollection` type from the `types/collection` module to define the shape of the paginated collection prop.

// The `Props` interface defines the shape of the props that the `Pagination` component expects. It includes:
// - `collection`: a `PagedCollection` object that contains the paginated data and navigation links.
// - `getPagePath`: a function that takes a path string and returns a formatted page path string.

// The `Pagination` component takes `collection` and `getPagePath` as props and returns a JSX structure that represents the pagination controls. This structure includes:
// - A `div` container with a `text-center` class for centering the pagination controls.
// - A `nav` element with various classes for styling the pagination controls, including text size, font weight, border, and hover effects.
// - Several `Link` components for navigating to the first, previous, next, and last pages of the collection. Each link uses the `getPagePath` function to generate the href attribute and includes conditional classes to disable the link if the corresponding page is not available.

// The `view` constant extracts the `hydra:view` property from the `collection` object, which contains the pagination links.
// If the `view` is not available, the component returns `null` and does not render any pagination controls.

// The `first`, `previous`, `next`, and `last` constants extract the corresponding pagination links from the `view` object.

// Finally, the `Pagination` component is exported as the default export of the module.

import Link from "next/link";
import { PagedCollection } from "../../types/collection";

interface Props {
  collection: PagedCollection<unknown>;
  // eslint-disable-next-line no-unused-vars
  getPagePath: (path: string) => string;
}

const Pagination = ({ collection, getPagePath }: Props) => {
  const view = collection && collection["hydra:view"];
  if (!view) return null;

  const {
    "hydra:first": first,
    "hydra:previous": previous,
    "hydra:next": next,
    "hydra:last": last,
  } = view;

  return (
    <div className="text-center">
      <nav
        className="text-xs font-bold inline-flex mx-auto divide-x-2 divide-gray-200 flex-row flex-wrap items-center justify-center mb-4 border-2 border-gray-200 rounded-2xl overflow-hidden"
        aria-label="Page navigation"
      >
        <Link
          href={first ? getPagePath(first) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="First page"
        >
          <span aria-hidden="true">&lArr;</span> First
        </Link>
        <Link
          href={previous ? getPagePath(previous) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            previous ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="Previous page"
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          href={next ? getPagePath(next) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : " text-gray-500 pointer-events-none"
          }`}
          aria-label="Next page"
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          href={last ? getPagePath(last) : "#"}
          className={`text-black p-3 hover:text-cyan-500 hover:bg-cyan-50 ${
            next ? "" : "text-gray-500 pointer-events-none"
          }`}
          aria-label="Last page"
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    </div>
  );
};

export default Pagination;

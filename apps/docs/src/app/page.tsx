import { toSlug } from "@acme/utils";
import {
  Arrowarrowleftsm,
  Arrowarrowrightsm,
  Arrowchevrondown,
  Arrowchevronup,
  Arrowexpand,
  Arrowshrink,
  Arrowcaretcircledown,
  Arrowcaretcircleup,
  Elementtaglabel,
} from "@figmicon/icons";

export default function Page() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Elementtaglabel className="text-blue-500" />
            Figmicon Icons Demo
          </h1>
          <p className="text-gray-600 mb-8">
            A collection of React icon components converted from SVG using SVGR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Navigation Icons */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <div className="flex gap-4 items-center">
              <Arrowarrowleftsm className="w-6 h-6 text-gray-700" />
              <Arrowarrowrightsm className="w-6 h-6 text-gray-700" />
              <Arrowchevrondown className="w-6 h-6 text-gray-700" />
              <Arrowchevronup className="w-6 h-6 text-gray-700" />
            </div>
          </div>

          {/* Control Icons */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Controls</h3>
            <div className="flex gap-4 items-center">
              <Arrowexpand className="w-6 h-6 text-green-600" />
              <Arrowshrink className="w-6 h-6 text-red-600" />
              <Arrowcaretcircledown className="w-6 h-6 text-blue-600" />
              <Arrowcaretcircleup className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          {/* Usage Example */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Interactive</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <Arrowarrowrightsm className="w-4 h-4" />
              Click me
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <Arrowcaretcircledown className="w-4 h-4 text-green-500" />
              74 icon components generated from SVG files
            </li>
            <li className="flex items-center gap-2">
              <Arrowcaretcircledown className="w-4 h-4 text-green-500" />
              TypeScript support with proper types
            </li>
            <li className="flex items-center gap-2">
              <Arrowcaretcircledown className="w-4 h-4 text-green-500" />
              Customizable colors using currentColor
            </li>
            <li className="flex items-center gap-2">
              <Arrowcaretcircledown className="w-4 h-4 text-green-500" />
              Tree-shakable imports for optimal bundle size
            </li>
          </ul>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Usage Example:</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {`import { Arrowarrowleftsm, Arrowarrowrightsm } from "@figmicon/icons";

function MyComponent() {
  return (
    <button className="flex items-center gap-2">
      <Arrowarrowleftsm className="w-4 h-4" />
      Back
    </button>
  );
}`}
          </pre>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Slug example: {toSlug("Hello World")}
        </div>
      </div>
    </main>
  );
}

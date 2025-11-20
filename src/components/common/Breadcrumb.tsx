import React from "react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 text-gray-600">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <svg
                className="h-5 w-5 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.onClick && !item.isActive ? (
              <button
                onClick={item.onClick}
                className="text-lg font-medium hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span
                className={`text-lg font-medium ${
                  item.isActive ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

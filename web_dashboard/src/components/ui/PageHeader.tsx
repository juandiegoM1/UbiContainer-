type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto">{action}</div>}
    </div>
  );
}

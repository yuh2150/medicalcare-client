// Featured List Wrapper
interface FeaturedListProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  background?: 'white' | 'gray';
}

export function FeaturedList({ title, subtitle, children, background = 'gray' }: FeaturedListProps) {
  return (
    <section className={`py-20 ${background === 'white' ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children}
        </div>
      </div>
    </section>
  );
}

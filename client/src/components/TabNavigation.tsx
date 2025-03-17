import { Link, useLocation } from 'wouter';

const TabNavigation = () => {
  const [location] = useLocation();

  const tabs = [
    { name: 'My Wardrobe', path: '/wardrobe' },
    { name: 'Outfits', path: '/outfits' },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Sustainability', path: '/sustainability' }
  ];

  // Check if we're on the home page (which should show wardrobe)
  const activePath = location === '/' ? '/wardrobe' : location;

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <Link key={tab.path} href={tab.path}>
            <a 
              className={`py-4 px-1 font-medium text-sm mr-8 ${
                activePath === tab.path 
                  ? 'border-primary text-primary border-b-2' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;

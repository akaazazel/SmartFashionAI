import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartWardrobe AI. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/privacy">
              <span className="text-gray-500 hover:text-gray-700 mx-2 cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms">
              <span className="text-gray-500 hover:text-gray-700 mx-2 cursor-pointer">Terms of Service</span>
            </Link>
            <Link href="/contact">
              <span className="text-gray-500 hover:text-gray-700 mx-2 cursor-pointer">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

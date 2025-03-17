import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartWardrobe AI. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/privacy">
              <a className="text-gray-500 hover:text-gray-700 mx-2">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-500 hover:text-gray-700 mx-2">Terms of Service</a>
            </Link>
            <Link href="/contact">
              <a className="text-gray-500 hover:text-gray-700 mx-2">Contact Us</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

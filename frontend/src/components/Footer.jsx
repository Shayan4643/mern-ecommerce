import { FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-8 mt-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-8 text-2xl">
          <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-300 cursor-pointer">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors duration-300 cursor-pointer">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-red-600 transition-colors duration-300 cursor-pointer">
            <FaYoutube />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
            <FaTiktok />
          </a>
        </div>
        <div>
            <ul className="flex flex-wrap justify-center gap-6 text-gray-400 font-medium">
                <li className="hover:text-white cursor-pointer transition-colors duration-300">About</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Contact</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">FAQ</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Shipping</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-300">Returns</li>
            </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-500 text-sm border-t border-gray-700 pt-4">
        <p>&copy; 2026 E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
}


import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../../config/appRoutes'

const footerLinks = [
  { label: 'Home', path: APP_ROUTES.home },
  { label: 'About Us', path: APP_ROUTES.about },
  { label: 'Products', path: APP_ROUTES.products },
  { label: 'Contact', path: APP_ROUTES.contact },
]

function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-3 gap-10">

          {/* Company Information */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              UHPCViet
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              High Performance Concrete Solutions.
              Delivering innovative concrete solutions
              for modern construction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400
                               hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">
              Contact Us
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed">
              Get in touch with our team to learn more
              about our products and solutions.
            </p>

            <Link
              to={APP_ROUTES.contact}
              className="inline-block mt-4 text-sm
                         text-white underline underline-offset-4
                         hover:text-blue-300 transition-colors"
            >
              Send an inquiry
            </Link>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} UHPCViet.
            All rights reserved.
          </p>
        </div>

      </div>

    </footer>
  )
}

export default Footer

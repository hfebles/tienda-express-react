
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-10 pb-6 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand/Logo */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-brand-primary mr-2" />
              <span className="text-xl font-bold">TiendaExpress</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Tu tienda online de confianza para todos tus productos favoritos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/productos" className="text-gray-600 hover:text-brand-primary text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="text-gray-600 hover:text-brand-primary text-sm">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="text-gray-600 hover:text-brand-primary text-sm">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/nuevos" className="text-gray-600 hover:text-brand-primary text-sm">
                  Nuevos Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contacto" className="text-gray-600 hover:text-brand-primary text-sm">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-primary text-sm">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className="text-gray-600 hover:text-brand-primary text-sm">
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-gray-600 hover:text-brand-primary text-sm">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-primary mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Av. Principal 123, Ciudad Demo
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-gray-600 text-sm">+58 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-brand-primary mr-2" />
                <span className="text-gray-600 text-sm">info@tiendaexpress.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} TiendaExpress. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

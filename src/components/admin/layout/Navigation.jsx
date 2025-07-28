import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Layers,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';

const Navigation = () => {
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, current: router.pathname === '/admin/dashboard' },
    { name: 'Products', href: '/admin/products', icon: Package, current: router.pathname.startsWith('/admin/products') },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: router.pathname.startsWith('/admin/orders') && !router.pathname.includes('preorders') },
    { name: 'Preorders', href: '/admin/orders/preorders', icon: ShoppingBag, current: router.pathname === '/admin/orders/preorders' },
    { name: 'Customers', href: '/admin/customers', icon: Users, current: router.pathname.startsWith('/admin/customers') },
    { name: 'Inventory', href: '/admin/inventory', icon: Layers, current: router.pathname.startsWith('/admin/inventory') },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: router.pathname.startsWith('/admin/analytics') },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare, current: router.pathname.startsWith('/admin/reviews') },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: router.pathname.startsWith('/admin/settings') },
  ];

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${item.current
                ? 'bg-primary-100 text-primary-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Icon
              className={`
                mr-3 h-5 w-5 flex-shrink-0
                ${item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
              `}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
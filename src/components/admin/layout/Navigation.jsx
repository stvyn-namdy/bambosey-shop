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
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: router.pathname === '/dashboard' },
    { name: 'Products', href: '/products', icon: Package, current: router.pathname.startsWith('/products') },
    { name: 'Orders', href: '/orders', icon: ShoppingCart, current: router.pathname.startsWith('/orders') && !router.pathname.includes('preorders') },
    { name: 'Preorders', href: '/orders/preorders', icon: ShoppingBag, current: router.pathname === '/orders/preorders' },
    { name: 'Customers', href: '/customers', icon: Users, current: router.pathname.startsWith('/customers') },
    { name: 'Inventory', href: '/inventory', icon: Layers, current: router.pathname.startsWith('/inventory') },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, current: router.pathname.startsWith('/analytics') },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare, current: router.pathname.startsWith('/reviews') },
    { name: 'Settings', href: '/settings', icon: Settings, current: router.pathname.startsWith('/settings') },
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
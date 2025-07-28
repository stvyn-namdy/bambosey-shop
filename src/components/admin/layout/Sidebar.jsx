import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

const Sidebar = ({ open, setOpen, user }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, current: router.pathname === '/admin/dashboard' },
    { name: 'Products', href: '/admin/products', icon: Package, current: router.pathname.startsWith('/admin/products') },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: router.pathname.startsWith('/admin/orders') },
    { name: 'Preorders', href: '/admin/orders/preorders', icon: ShoppingBag, current: router.pathname === '/admin/orders/preorders' },
    { name: 'Customers', href: '/admin/customers', icon: Users, current: router.pathname.startsWith('/admin/customers') },
    { name: 'Inventory', href: '/admin/inventory', icon: Layers, current: router.pathname.startsWith('/admin/inventory') },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: router.pathname.startsWith('/admin/analytics') },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare, current: router.pathname.startsWith('/admin/reviews') },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: router.pathname.startsWith('/admin/settings') },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900">
              Bam & Bosey
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${item.current
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {!collapsed && user && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
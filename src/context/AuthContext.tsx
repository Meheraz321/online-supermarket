import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Address } from '../types';
import { SAMPLE_USERS } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  wishlist: string[];
  isAuthenticated: boolean;
  login: (emailOrPhone: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  saveAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sm_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        delete parsed.avatarUrl;
        return parsed;
      } catch (e) { /* ignore */ }
    }
    const defaultUser = { ...SAMPLE_USERS[0] };
    delete defaultUser.avatarUrl;
    return defaultUser; // Default to Tanvir Ahmed (Customer)
  });

  const [allUsers, setAllUsers] = useState<User[]>(SAMPLE_USERS.map(u => {
    const clean = { ...u };
    delete clean.avatarUrl;
    return clean;
  }));
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sm_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['prod-001', 'prod-010', 'prod-017'];
  });

  useEffect(() => {
    if (user) {
      const cleanUser = { ...user };
      delete cleanUser.avatarUrl;
      localStorage.setItem('sm_current_user', JSON.stringify(cleanUser));
    } else {
      localStorage.removeItem('sm_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const login = async (emailOrPhone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone })
      });
      const data = await res.json();
      if (data.success && data.data) {
        delete data.data.avatarUrl;
        setUser(data.data);
        return true;
      }
    } catch (err) {
      console.warn('Backend login fallback to local sample user', err);
    }
    // Local fallback
    const found = allUsers.find(u => u.email === emailOrPhone || u.phone === emailOrPhone) || allUsers[0];
    const cleanFound = { ...found };
    delete cleanFound.avatarUrl;
    setUser(cleanFound);
    return true;
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role: 'customer' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        delete data.data.avatarUrl;
        setUser(data.data);
        setAllUsers(prev => [...prev, data.data]);
        return true;
      }
    } catch (err) {
      console.warn('Backend register fallback', err);
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      loyaltyPoints: 50,
      createdAt: new Date().toISOString(),
      addresses: []
    };
    setUser(newUser);
    setAllUsers(prev => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    // Switch to non-admin default customer or clear
    setUser(null);
  };

  const switchRole = (role: Role) => {
    const matched = allUsers.find(u => u.role === role);
    if (matched) {
      setUser(matched);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const saveAddress = (address: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    const updated = {
      ...user,
      addresses: [...(user.addresses || []), newAddress]
    };
    setUser(updated);
  };

  const removeAddress = (addressId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      addresses: user.addresses.filter(a => a.id !== addressId)
    };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        wishlist,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchRole,
        toggleWishlist,
        isInWishlist,
        saveAddress,
        removeAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

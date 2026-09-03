import React from 'react';
import SharedLayout from '../components/SharedLayout';
import { shopNavigation, shopUser } from '../config/navigation';

export default function ShopLayout() {
  return <SharedLayout navigation={shopNavigation} user={shopUser} />;
}

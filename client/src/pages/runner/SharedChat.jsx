import React from 'react';
import RunnerSidebarFix from './RunnerSidebarFix';
import OrderChatHub from '../../components/chat/OrderChatHub';

export default function SharedChat() {
  return (
    <>
      <RunnerSidebarFix />
      <div className="p-2">
        <OrderChatHub />
      </div>
    </>
  );
}

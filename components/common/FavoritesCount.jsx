"use client";
import React from 'react';
import { useFavorites } from '@/components/contexts/FavoritesContext';

export default function FavoritesCount({ 
  showLabel = true, 
  className = '',
  icon = true,
  format = 'parentheses' // 'parentheses', 'badge', 'text'
}) {
  const { favoritesCount, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <span className={className}>
{icon && <i className="icon-save" style={{ marginRight: '8px' }} />}
        {showLabel && 'My favorites'} <span>(...)</span>
      </span>
    );
  }

  const renderCount = () => {
    switch (format) {
      case 'badge':
        return (
          <span className={`badge ${favoritesCount > 0 ? 'bg-main' : 'bg-gray'}`}>
            {favoritesCount}
          </span>
        );
      case 'text':
        return <span>{favoritesCount} favorite{favoritesCount !== 1 ? 's' : ''}</span>;
      case 'parentheses':
      default:
        return <span>({favoritesCount})</span>;
    }
  };

  return (
    <span className={className}>
      {icon && <i className="icon-save" style={{ marginRight: '8px' }} />}
      {showLabel && 'My favorites'} {renderCount()}
    </span>
  );
}

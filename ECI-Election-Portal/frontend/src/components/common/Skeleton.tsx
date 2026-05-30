import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function Skeleton({ width, height, borderRadius, className = '' }: SkeletonProps) {
  return (
    <div 
      className={`skeleton-base ${className}`} 
      style={{ 
        width: width || '100%', 
        height: height || '20px',
        borderRadius: borderRadius || '4px'
      }} 
    />
  );
}

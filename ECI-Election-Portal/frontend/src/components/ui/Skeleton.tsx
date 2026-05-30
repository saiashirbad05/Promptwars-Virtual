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
      className={`skeleton-box ${className}`} 
      style={{ width, height, borderRadius }}
    />
  );
}

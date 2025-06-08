'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { WORK_ICONS, WorkIcon } from '../../lib/types/work-types';
import * as Icons from 'react-icons/fi';

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  showSearch?: boolean;
}

// 아이콘 카테고리 정의
const ICON_CATEGORIES = {
  업무: ['FiBriefcase', 'FiClipboard', 'FiFile', 'FiEdit3', 'FiMonitor', 'FiCpu', 'FiCode', 'FiTool'],
  장소: ['FiHome', 'FiBuilding', 'FiMapPin', 'FiNavigation'],
  시간: ['FiClock', 'FiCalendar', 'FiWatch'],
  커뮤니케이션: ['FiPhone', 'FiMail', 'FiMessageSquare', 'FiUsers'],
  기타: ['FiStar', 'FiHeart', 'FiTarget', 'FiTrendingUp', 'FiZap', 'FiGift', 'FiAward', 'FiShield']
};

export function IconPicker({ selectedIcon, onIconSelect, showSearch = true }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 검색 및 카테고리 필터링
  const filteredIcons = useMemo(() => {
    let icons: string[] = WORK_ICONS as string[];

    // 카테고리 필터
    if (selectedCategory !== '전체') {
        icons = [...ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES]];
    }

    // 검색 필터
    if (searchQuery.trim()) {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  // 아이콘 컴포넌트 렌더링
  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 제목 */}
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          아이콘 선택
        </h4>

        {/* 검색 */}
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder="아이콘 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-10 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Icons.FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        )}

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-1">
          {['전체', ...Object.keys(ICON_CATEGORIES)].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 text-xs rounded-full transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 아이콘 그리드 */}
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
          {filteredIcons.map((iconName) => (
            <button
              key={iconName}
              onClick={() => onIconSelect(iconName)}
              className={`
                p-3 rounded-lg border-2 transition-all hover:scale-105
                ${selectedIcon === iconName
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
              title={iconName}
            >
              <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                {renderIcon(iconName)}
              </div>
            </button>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icons.FiSearch size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 선택된 아이콘 정보 */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-200 dark:border-gray-600">
            {renderIcon(selectedIcon)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="font-mono">{selectedIcon}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 간단한 아이콘 버튼 컴포넌트
interface IconButtonProps {
  icon: string;
  selected?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function IconButton({ 
  icon, 
  selected = false, 
  onClick, 
  size = 'md',
  color,
  className = '' 
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <button
      className={`
        ${sizeClasses[size]} rounded-lg border-2 transition-all flex items-center justify-center
        ${selected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 scale-110' 
          : 'border-gray-200 dark:border-gray-600 hover:scale-105 text-gray-600 dark:text-gray-300'
        }
        ${className}
      `}
      onClick={onClick}
      title={icon}
      style={color ? { color } : undefined}
    >
      {IconComponent && <IconComponent size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />}
    </button>
  );
}

// 아이콘과 색상을 함께 표시하는 컴포넌트
interface IconWithColorProps {
  icon: string;
  color: string;
  size?: number;
  className?: string;
}

export function IconWithColor({ icon, color, size = 20, className = '' }: IconWithColorProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

  return (
    <div className={className}>
      {IconComponent && (
        <IconComponent 
          size={size} 
          style={{ color }}
          className="drop-shadow-sm"
        />
      )}
    </div>
  );
}
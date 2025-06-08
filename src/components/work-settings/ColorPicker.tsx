'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PRESET_COLORS, PresetColor } from '../../lib/types/work-types';
import { Card } from '../ui/Card';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  showCustomPicker?: boolean;
}

export function ColorPicker({ 
  color, 
  onChange, 
  presetColors = PRESET_COLORS,
  showCustomPicker = true 
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 제목 */}
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          색상 선택
        </h4>

        {/* 프리셋 색상들 */}
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className={`
                w-10 h-10 rounded-lg border-2 transition-all
                ${color === presetColor 
                  ? 'border-gray-900 dark:border-gray-100 scale-110 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                }
              `}
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
              title={presetColor}
            />
          ))}
        </div>

        {/* 커스텀 색상 선택기 토글 */}
        {showCustomPicker && (
          <div className="space-y-3">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <span>{showCustom ? '숨기기' : '커스텀 색상'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showCustom ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 커스텀 색상 선택기 */}
            {showCustom && (
              <div className="space-y-3">
                <HexColorPicker
                  color={color}
                  onChange={onChange}
                  style={{ width: '100%', height: '150px' }}
                />
                
                {/* 현재 색상 및 HEX 값 */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                  <input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                        onChange(value);
                      }
                    }}
                    className="flex-1 px-3 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 색상 정보 */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          선택된 색상: <span className="font-mono">{color.toUpperCase()}</span>
        </div>
      </div>
    </Card>
  );
}

// 간단한 색상 버튼 컴포넌트
interface ColorButtonProps {
  color: string;
  selected?: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorButton({ 
  color, 
  selected = false, 
  onClick, 
  size = 'md',
  className = '' 
}: ColorButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      className={`
        ${sizeClasses[size]} rounded-lg border-2 transition-all
        ${selected 
          ? 'border-gray-900 dark:border-gray-100 scale-110 shadow-lg' 
          : 'border-gray-200 dark:border-gray-600 hover:scale-105'
        }
        ${className}
      `}
      style={{ backgroundColor: color }}
      onClick={onClick}
      title={color}
    />
  );
}

// 색상 팔레트 컴포넌트
interface ColorPaletteProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  columns?: number;
}

export function ColorPalette({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  columns = 5 
}: ColorPaletteProps) {
  return (
    <div 
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {colors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          selected={selectedColor === color}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
}
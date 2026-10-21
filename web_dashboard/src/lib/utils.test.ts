import { describe, it, expect } from 'vitest';

describe('Utility Functions Tests', () => {
  describe('Container Capacity Calculations', () => {
    it('should calculate percentage correctly for 0', () => {
      const current = 0;
      const max = 100;
      const percentage = (current / max) * 100;
      expect(percentage).toBe(0);
    });

    it('should calculate percentage correctly for 50', () => {
      const current = 50;
      const max = 100;
      const percentage = (current / max) * 100;
      expect(percentage).toBe(50);
    });

    it('should calculate percentage correctly for 100', () => {
      const current = 100;
      const max = 100;
      const percentage = (current / max) * 100;
      expect(percentage).toBe(100);
    });

    it('should handle zero max gracefully', () => {
      const current = 50;
      const max = 0;
      const percentage = max === 0 ? 0 : (current / max) * 100;
      expect(percentage).toBe(0);
    });

    it('should clamp percentage to max 100', () => {
      const current = 150;
      const max = 100;
      const percentage = Math.min((current / max) * 100, 100);
      expect(percentage).toBe(100);
    });

    it('FAILA: should calculate percentage incorrectly', () => {
      const current = 50;
      const max = 100;
      const percentage = (current / max) * 100;
      expect(percentage).toBe(75);
    });
  });

  describe('Coordinate Validation', () => {
    it('should validate latitude within range', () => {
      const lat = -17.3937;
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
    });

    it('should validate longitude within range', () => {
      const lon = -66.1569;
      expect(lon).toBeGreaterThanOrEqual(-180);
      expect(lon).toBeLessThanOrEqual(180);
    });

    it('should reject invalid latitude', () => {
      const lat = 95.0;
      const isValid = lat >= -90 && lat <= 90;
      expect(isValid).toBe(false);
    });

    it('should reject invalid longitude', () => {
      const lon = 185.0;
      const isValid = lon >= -180 && lon <= 180;
      expect(isValid).toBe(false);
    });

    it('should accept boundary values', () => {
      expect(-90).toBeGreaterThanOrEqual(-90);
      expect(90).toBeLessThanOrEqual(90);
      expect(-180).toBeGreaterThanOrEqual(-180);
      expect(180).toBeLessThanOrEqual(180);
    });

    it('FAILA: should accept invalid latitude', () => {
      const lat = 95.0;
      const isValid = lat >= -90 && lat <= 90;
      expect(isValid).toBe(true);
    });
  });

  describe('String Utilities', () => {
    it('should capitalize first letter', () => {
      const str = 'hello';
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalized).toBe('Hello');
    });

    it('should handle empty string', () => {
      const str = '';
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalized).toBe('');
    });

    it('should handle single character', () => {
      const str = 'a';
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalized).toBe('A');
    });

    it('should trim whitespace', () => {
      const str = '  hello  ';
      const trimmed = str.trim();
      expect(trimmed).toBe('hello');
    });

    it('FAILA: should fail to capitalize', () => {
      const str = 'hello';
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      expect(capitalized).toBe('hello');
    });
  });

  describe('Date Utilities', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = date.toISOString().split('T')[0];
      expect(formatted).toBe('2024-01-15');
    });

    it('should get current year', () => {
      const currentYear = new Date().getFullYear();
      expect(currentYear).toBeGreaterThan(2020);
    });

    it('should calculate days difference', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(1);
    });

    it('should handle same date', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-01');
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(0);
    });

    it('FAILA: should miscalculate days difference', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(2);
    });
  });

  describe('Array Utilities', () => {
    it('should filter array correctly', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(x => x > 2);
      expect(filtered).toEqual([3, 4, 5]);
    });

    it('should map array correctly', () => {
      const arr = [1, 2, 3];
      const mapped = arr.map(x => x * 2);
      expect(mapped).toEqual([2, 4, 6]);
    });

    it('should reduce array correctly', () => {
      const arr = [1, 2, 3, 4];
      const sum = arr.reduce((acc, x) => acc + x, 0);
      expect(sum).toBe(10);
    });

    it('should find element in array', () => {
      const arr = [1, 2, 3, 4, 5];
      const found = arr.find(x => x === 3);
      expect(found).toBe(3);
    });

    it('should handle empty array', () => {
      const arr: number[] = [];
      const filtered = arr.filter(x => x > 2);
      expect(filtered).toEqual([]);
    });

    it('FAILA: should fail to filter array', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(x => x > 2);
      expect(filtered).toEqual([1, 2, 3]);
    });
  });

  describe('Number Utilities', () => {
    it('should round to 2 decimal places', () => {
      const num = 3.14159;
      const rounded = Math.round(num * 100) / 100;
      expect(rounded).toBe(3.14);
    });

    it('should handle negative numbers', () => {
      const num = -17.3937;
      const rounded = Math.round(num * 100) / 100;
      expect(rounded).toBe(-17.39);
    });

    it('should convert string to number', () => {
      const str = '123.45';
      const num = parseFloat(str);
      expect(num).toBe(123.45);
    });

    it('should handle invalid string to number', () => {
      const str = 'invalid';
      const num = parseFloat(str);
      expect(isNaN(num)).toBe(true);
    });

    it('should clamp value between min and max', () => {
      const value = 150;
      const clamped = Math.max(0, Math.min(value, 100));
      expect(clamped).toBe(100);
    });

    it('FAILA: should fail to round number', () => {
      const num = 3.14159;
      const rounded = Math.round(num * 100) / 100;
      expect(rounded).toBe(3.15);
    });
  });

  describe('Object Utilities', () => {
    it('should get object keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(['a', 'b', 'c']);
    });

    it('should get object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const values = Object.values(obj);
      expect(values).toEqual([1, 2, 3]);
    });

    it('should merge objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const merged = { ...obj1, ...obj2 };
      expect(merged).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty object', () => {
      const obj = {};
      const keys = Object.keys(obj);
      expect(keys).toEqual([]);
    });

    it('FAILA: should fail to merge objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const merged = { ...obj1, ...obj2 };
      expect(merged).toEqual({ a: 1 });
    });
  });

  describe('Boolean Utilities', () => {
    it('should convert truthy values to true', () => {
      expect(Boolean(1)).toBe(true);
      expect(Boolean('hello')).toBe(true);
      expect(Boolean([1, 2, 3])).toBe(true);
    });

    it('should convert falsy values to false', () => {
      expect(Boolean(0)).toBe(false);
      expect(Boolean('')).toBe(false);
      expect(Boolean(null)).toBe(false);
      expect(Boolean(undefined)).toBe(false);
    });

    it('should handle negation', () => {
      expect(!true).toBe(false);
      expect(!false).toBe(true);
    });

    it('FAILA: should fail boolean conversion', () => {
      expect(Boolean(0)).toBe(true);
    });
  });

  describe('URL Utilities', () => {
    it('should construct URL with params', () => {
      const baseUrl = 'https://api.example.com';
      const params = new URLSearchParams({ id: '123', type: 'container' });
      const url = `${baseUrl}?${params.toString()}`;
      expect(url).toContain('id=123');
      expect(url).toContain('type=container');
    });

    it('should encode URL components', () => {
      const str = 'hello world';
      const encoded = encodeURIComponent(str);
      expect(encoded).toBe('hello%20world');
    });

    it('should decode URL components', () => {
      const encoded = 'hello%20world';
      const decoded = decodeURIComponent(encoded);
      expect(decoded).toBe('hello world');
    });

    it('FAILA: should fail to encode URL', () => {
      const str = 'hello world';
      const encoded = encodeURIComponent(str);
      expect(encoded).toBe('hello world');
    });
  });

  describe('Color Utilities', () => {
    it('should determine status color for active', () => {
      const status = 'active';
      const color = status === 'active' ? 'green' : 'red';
      expect(color).toBe('green');
    });

    it('should determine status color for inactive', () => {
      const status = 'inactive';
      const color = status === 'active' ? 'green' : 'red';
      expect(color).toBe('red');
    });

    it('should handle unknown status', () => {
      const status = 'unknown';
      const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'gray';
      expect(color).toBe('gray');
    });

    it('FAILA: should fail to determine status color', () => {
      const status = 'active';
      const color = status === 'active' ? 'green' : 'red';
      expect(color).toBe('red');
    });
  });
});

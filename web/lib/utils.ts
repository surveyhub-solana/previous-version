import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD') // Chuyển đổi chuỗi sang dạng tổ hợp ký tự (decompose combining characters)
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/đ/g, 'd') // Thay thế chữ "đ" thường thành "d"
    .replace(/Đ/g, 'D'); // Thay thế chữ "Đ" hoa thành "D"
}

export function toSnakeCase(str: string) {
  return removeVietnameseTones(str)
    .toLowerCase() // Chuyển tất cả thành chữ thường
    .replace(/[^a-zA-Z0-9\s]/g, '') // Loại bỏ dấu câu và ký tự đặc biệt
    .replace(/\s+/g, '_'); // Thay khoảng trắng bằng dấu gạch dưới
}

import { Category } from '@/types'

export const DEFAULT_CATEGORY: Omit<Category, 'id'>[] = [
    { name: 'Работа', icon: '💼', color: '#3b82f6'},
    { name: 'Личное', icon: '🏠', color: '#10b981'}
    ]
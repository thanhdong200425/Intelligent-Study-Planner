# Quy Tắc Phát Triển Frontend

## 1. Component Architecture

### 1.1. Tạo Component Tái Sử Dụng

- **Luôn ưu tiên tạo các component có thể tái sử dụng** thay vì viết code trùng lặp
- Đặt các component tái sử dụng trong thư mục `src/components/`
- Đặt tên component rõ ràng, mô tả đúng chức năng
- Mỗi component nên có một trách nhiệm duy nhất (Single Responsibility Principle)
- Sử dụng TypeScript để định nghĩa props với interface/type rõ ràng
- Không đặt các components theo page!.

## 2. HeroUI Components

### 2.1. Ưu Tiên Sử Dụng HeroUI

- **Luôn ưu tiên sử dụng component từ HeroUI** trước khi tự tạo component mới
- Kiểm tra thư viện HeroUI xem có component phù hợp không trước khi implement
- Nếu HeroUI không có component cần thiết, mới tạo component custom

### 2.2. Customization

- Có thể customize HeroUI components thông qua props và theme
- Không nên override quá nhiều style của HeroUI, ưu tiên sử dụng props có sẵn

## 3. Data Fetching với React Query

### 3.1. Sử Dụng React Query

- **Bắt buộc sử dụng React Query (TanStack Query)** cho tất cả data fetching
- Không sử dụng `useEffect` + `fetch` trực tiếp cho data fetching
- Tách biệt code fetch logic ra folder services thay vì viết trong components như 2 phần 3.2 và 3.3

### 3.2. Query Hooks Pattern

```typescript
// Ví dụ: src/hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query';
import { tasksService } from '@/services/tasks';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksService.getAll(),
  });
};
```

### 3.3. Mutation Hooks Pattern

```typescript
// Ví dụ: src/hooks/useCreateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/services/tasks';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

### 3.4. Best Practices

- Luôn đặt tên `queryKey` có cấu trúc và nhất quán (ví dụ: `['tasks']`, `['task', id]`)
- Sử dụng `queryClient.invalidateQueries` để refetch data sau mutation
- Xử lý loading và error states từ React Query hooks
- Sử dụng `staleTime` và `cacheTime` phù hợp để optimize performance

## 4. Form Management với React Hook Form

### 4.1. Sử Dụng React Hook Form

- **Bắt buộc sử dụng React Hook Form** cho tất cả form management
- Không sử dụng controlled components với `useState` cho form
- Kết hợp React Hook Form với HeroUI form components

### 4.2. Form Pattern

```typescript
// Ví dụ: Component form với React Hook Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const TaskForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle submit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### 4.3. Validation

- Sử dụng Zod schema validation kết hợp với React Hook Form
- Đặt validation schemas trong file riêng hoặc cùng file với component
- Hiển thị error messages rõ ràng cho người dùng

## 5. Server Components vs Client Components

### 5.1. Ưu Tiên Server Components

- **Luôn ưu tiên sử dụng Server Components** (mặc định trong Next.js App Router)
- Server Components giúp giảm bundle size và cải thiện performance
- Server Components có thể fetch data trực tiếp, không cần React Query

### 5.2. Khi Nào Sử Dụng Client Components

- **Chỉ sử dụng Client Component** (`'use client'`) khi component có:
  - Event handlers (onClick, onChange, onSubmit, etc.)
  - Hooks như `useState`, `useEffect`, `useContext`
  - Browser APIs (localStorage, window, document, etc.)
  - React Query hooks (vì cần client-side state)
  - React Hook Form (vì cần interactivity)
  - Animations hoặc transitions

### 5.3. Pattern Kết Hợp

```typescript
// Server Component (mặc định)
// app/tasks/page.tsx
import { TaskList } from '@/components/TaskList';
import { tasksService } from '@/services/tasks';

export default async function TasksPage() {
  // Fetch data ở server
  const tasks = await tasksService.getAll();

  return <TaskList initialTasks={tasks} />;
}

// Client Component (khi cần interactivity)
// components/TaskList.tsx
'use client';

import { useTasks } from '@/hooks/useTasks';

export const TaskList = ({ initialTasks }) => {
  // Có thể sử dụng React Query với initialData
  const { data: tasks } = useTasks({ initialData: initialTasks });

  // Có thể có interactivity
  return (
    <div>
      {tasks?.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
```

### 5.4. Best Practices

- Giữ Server Components ở top level của page/route
- Chỉ mark component là Client Component ở component nhỏ nhất cần thiết
- Tách phần interactive ra thành Client Component riêng, phần static giữ ở Server Component
- Sử dụng `initialData` hoặc `initialDataUpdatedAt` trong React Query khi có data từ Server Component

## 6. Code Organization

### 6.1. File Structure

- Tuân theo cấu trúc thư mục hiện tại
- Mỗi component nên có file riêng
- Đặt types/interfaces trong file `types.ts` hoặc cùng file với component
- Đặt services trong thư mục `src/services/`
- Đặt hooks trong thư mục `src/hooks/`

### 6.2. Naming Conventions

- Components: PascalCase (ví dụ: `TaskList.tsx`)
- Hooks: camelCase với prefix `use` (ví dụ: `useTasks.ts`)
- Services: camelCase (ví dụ: `tasksService.ts`)
- Types/Interfaces: PascalCase (ví dụ: `Task`, `CreateTaskDto`)

## 7. TypeScript

### 7.1. Type Safety

- Luôn sử dụng TypeScript, tránh sử dụng `any`
- Định nghĩa types cho tất cả props, state, và function parameters
- Sử dụng type inference khi có thể, nhưng explicit types cho public APIs

### 7.2. Type Definitions

- Đặt shared types trong `src/types/`
- Sử dụng Zod schemas để validate và infer types

## 8. Performance

### 8.1. Optimization

- Sử dụng `useMemo` và `useCallback` khi cần thiết

### 8.2. Bundle Size

- Ưu tiên Server Components để giảm bundle size
- Chỉ import những gì cần thiết từ libraries

## 9. Tổng Kết

**Những điểm quan trọng cần nhớ:**

1. ✅ Tạo reusable components
2. ✅ Ưu tiên HeroUI components
3. ✅ Sử dụng React Query cho data fetching
4. ✅ Sử dụng React Hook Form cho form management
5. ✅ Ưu tiên Server Components
6. ✅ Chỉ dùng Client Components khi có interactivity
7. ✅ TypeScript cho type safety
8. ✅ Code organization rõ ràng

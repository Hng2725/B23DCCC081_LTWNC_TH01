# Student Deadline Tracker

Ứng dụng web giúp sinh viên theo dõi deadline bài tập của các môn học: xem bài nào còn bao nhiêu ngày, bài nào đã quá hạn, đánh dấu bài đã làm xong.

---

## 1. Lưu ý

- Hạn nộp của dữ liệu mẫu được tính theo ngày hiện tại (ví dụ "hôm nay + 3 ngày"), nên mở app vào ngày nào cũng có đủ bài còn hạn, đến hạn hôm nay, quá hạn và đã hoàn thành.
- Dữ liệu chỉ lưu trong Redux store. Tải lại trang sẽ trở về danh sách mẫu.

---

## 2. Cấu trúc thư mục (feature-based)

```
src/
├── main.tsx                         # Bọc <App /> trong <Provider store={store}>
├── App.tsx                          # Bố cục trang: header, bộ lọc, danh sách, modal
├── app/
│   ├── store.ts                     # configureStore, RootState, AppDispatch
│   └── hooks.ts                     # useAppDispatch, useAppSelector (typed hooks)
├── components/
│   └── Modal.tsx                    # Modal dùng chung
├── hooks/
│   └── useForm.ts                   # Custom hook generic cho form
├── types/
│   └── common.ts                    # Kiểu generic dùng chung
├── utils/
│   ├── date.ts                      # Tính số ngày còn lại, định dạng ngày
│   └── typeGuards.ts                # Các type guard
└── features/
    ├── assignments/                 # Feature: bài tập
    │   ├── assignmentTypes.ts       # Kiểu Assignment, Priority, NewAssignment...
    │   ├── assignmentsAPI.ts        # API giả lập
    │   ├── assignmentsSlice.ts      # Slice + createAsyncThunk + selectors
    │   ├── useAssignments.ts        # Custom hook gói logic của feature
    │   └── components/
    │       ├── AssignmentCard.tsx   # Compound Component
    │       ├── AssignmentForm.tsx   # Form thêm bài tập
    │       └── AssignmentList.tsx   # Danh sách bài tập
    └── filter/                      # Feature: bộ lọc
        ├── filterSlice.ts
        └── components/
            └── FilterBar.tsx
```

### Luồng dữ liệu

```
assignmentsAPI ──(createAsyncThunk)──► Redux store ──(selectors)──► useAssignments ──(props)──► Components
                                            ▲                                                     │
                                            └──────────────── dispatch action ◄───────────────────┘
```

1. `App` gọi hook `useAssignments()`. Hook này dispatch `fetchAssignments()` khi app khởi động.
2. Thunk gọi API giả lập, kiểm tra dữ liệu bằng type guard rồi lưu vào store.
3. Selector lọc và sắp xếp danh sách theo bộ lọc hiện tại, `useAssignments` trả kết quả cho `App`.
4. Khi người dùng thêm, tick hoặc xoá, component gọi hàm từ `useAssignments`, hàm này dispatch action tương ứng lên store.

---

## 3. Vận dụng nội dung đã học

### Buổi 1 — TypeScript nâng cao

- **Generic:** `ApiResponse<T>`, `FormErrors<T>` ([common.ts](src/types/common.ts)); hàm `fakeRequest<T>` giả lập API ([assignmentsAPI.ts](src/features/assignments/assignmentsAPI.ts#L6)); hook `useForm<T>` dùng được cho mọi form ([useForm.ts](src/hooks/useForm.ts#L11)).
- **Utility types:**
  - `Omit<Assignment, 'id' | 'completed'>`: kiểu dữ liệu nhập khi thêm bài ([assignmentTypes.ts](src/features/assignments/assignmentTypes.ts#L13))
  - `Record<Priority, string>`, `Record<FilterStatus, string>`: bảng nhãn tiếng Việt ([assignmentTypes.ts](src/features/assignments/assignmentTypes.ts#L17), [filterSlice.ts](src/features/filter/filterSlice.ts#L5))
  - `Partial<Record<keyof T, string>>`: lỗi của form ([common.ts](src/types/common.ts#L11))
  - `ReturnType`: suy ra `RootState` ([store.ts](src/app/store.ts#L12))
- **Type guard:** `isAssignmentArray` kiểm tra dữ liệu API trước khi lưu vào store; `isPriority` dùng khi validate form; `isFilterStatus` biến `string[]` thành `FilterStatus[]` ([typeGuards.ts](src/utils/typeGuards.ts)).

### Buổi 2 — Design pattern React

- **Custom hook nâng cao:**
  - `useForm<T>` ([useForm.ts](src/hooks/useForm.ts)): quản lý giá trị, lỗi, validate, submit và reset form.
  - `useAssignments` ([useAssignments.ts](src/features/assignments/useAssignments.ts)): gom selector, dispatch, `useEffect` gọi API và `useCallback`. Component chỉ cần gọi hook này, không cần biết tới Redux.
- **Compound Component:** `AssignmentCard` ([AssignmentCard.tsx](src/features/assignments/components/AssignmentCard.tsx)). Component cha đưa dữ liệu bài tập vào Context. Các component con `.Subject`, `.Title`, `.Deadline`, `.Priority`, `.Status`, `.Actions` tự lấy dữ liệu, không cần truyền props. Cách dùng xem ở [AssignmentList.tsx](src/features/assignments/components/AssignmentList.tsx#L21-L32).

### Buổi 3 — Redux Toolkit + TypeScript

- **Feature-based structure:** chia code theo tính năng, `features/assignments` và `features/filter`. Mỗi feature có slice, type, component riêng (xem mục 2).
- **Typed hooks:** `useAppDispatch`, `useAppSelector` tạo bằng `.withTypes<>()` ([hooks.ts](src/app/hooks.ts)).
- **createAsyncThunk:** `fetchAssignments` lấy dữ liệu mẫu từ API giả lập, lỗi thì trả `rejectWithValue`. Trạng thái `pending / fulfilled / rejected` được xử lý trong `extraReducers` để hiện "Đang tải...", danh sách hoặc thông báo lỗi ([assignmentsSlice.ts](src/features/assignments/assignmentsSlice.ts#L22-L79)).
- **Slice + selector:** các action `addAssignment`, `toggleAssignment`, `deleteAssignment`, `setFilter`; `createSelector` để lọc danh sách và đếm số bài theo từng bộ lọc ([assignmentsSlice.ts](src/features/assignments/assignmentsSlice.ts#L104-L120)).

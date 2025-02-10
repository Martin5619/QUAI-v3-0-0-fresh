# Component Type Guidelines

## Component Categories

### 1. Client Components
Components that use:
- React hooks (useState, useEffect, etc.)
- Browser APIs
- Event handlers
- Interactive features

```typescript
"use client"

export function InteractiveComponent() {
  const [state, setState] = useState()
  // Client-side logic
}
```

### 2. Server Components
Components that:
- Fetch data
- Access backend resources
- Don't need interactivity
- Focus on static rendering

```typescript
// No "use client" directive needed
export function StaticComponent() {
  // Server-side logic
}
```

## Naming Conventions

### File Names
1. Client Components:
   ```
   ComponentName.client.tsx
   ```

2. Server Components:
   ```
   ComponentName.server.tsx
   ```

3. Default (Server):
   ```
   ComponentName.tsx
   ```

### Documentation
```typescript
/**
 * @component ComponentName
 * @type Client/Server Component
 * @uses List of hooks or special features
 * @requires Any special directives
 */
```

## Best Practices

### 1. Component Organization
- Keep client components at the leaves of the tree
- Use server components by default
- Split interactive parts into client components

### 2. Performance Considerations
- Minimize client-side JavaScript
- Use server components where possible
- Lazy load client components when needed

### 3. Data Fetching
- Prefer server components for data fetching
- Use React Suspense for loading states
- Implement proper error boundaries

### 4. State Management
- Keep state as close to usage as possible
- Use server components for static data
- Implement proper state lifting

## Example Structure
```
src/
├── components/
│   ├── client/
│   │   └── InteractiveFeature.client.tsx
│   ├── server/
│   │   └── StaticContent.server.tsx
│   └── shared/
│       └── Layout.tsx
```

## Migration Checklist
- [ ] Identify component type (client/server)
- [ ] Add appropriate directive
- [ ] Update file naming
- [ ] Add documentation
- [ ] Test functionality
- [ ] Verify performance

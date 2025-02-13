# Dashboard Components Specification
Created: 2025-02-13T09:42:00Z

## 1. Entity Icons System
**File:** `src/components/icons/entity-icons.tsx`

### Purpose
Provides consistent iconography and color schemes for different entity types across the application.

### Interface
```typescript
interface EntityIconsType {
  Document: React.FC<{ className?: string }>
  Question: React.FC<{ className?: string }>
  default: React.FC<{ className?: string }>
}

interface EntityColorsType {
  document: string
  question: string
  default: string
}
```

### Usage Example
```tsx
<EntityIcons.Document className="h-5 w-5" />
<div className={`bg-${EntityColors.document}`}>...</div>
```

### Implementation Requirements
- Must support dynamic sizing via className
- Must maintain consistent styling with design system
- Must support all entity types (Document, Question)
- Must provide fallback default icons

## 2. Quick Action Center
**File:** `src/components/dashboard/actions/quick-action-center.tsx`

### Purpose
Provides quick access to common actions in the dashboard.

### Props Interface
```typescript
interface QuickActionCenterProps {
  className?: string
  userId: string
}
```

### Features
1. Document Creation
   - New document button
   - Upload document button
   - Quick templates

2. Question Generation
   - Ask question button
   - Recent questions list

3. Usage Overview
   - Storage usage
   - Document count
   - Question count

### Implementation Requirements
- Must integrate with document system
- Must handle file uploads
- Must track usage metrics
- Must respect user plan limits

## 3. Usage Circles
**File:** `src/components/dashboard/usage/usage-circles.tsx`

### Purpose
Visual representation of user's resource usage and limits.

### Props Interface
```typescript
interface UsageMetrics {
  documentsUsed: number
  questionsGenerated: number
  storageUsed: number
  tokensUsed: number
}

interface UsageCirclesProps {
  metrics: UsageMetrics
  className?: string
}
```

### Features
1. Document Usage Circle
   - Shows used/total documents
   - Color-coded status

2. Storage Usage Circle
   - Shows used/total storage
   - Converts bytes to readable format

3. Question Usage Circle
   - Shows used/total questions
   - Handles infinite limits for pro users

### Implementation Requirements
- Must use consistent color scheme
- Must show percentage and raw numbers
- Must handle loading states
- Must update in real-time
- Must show warnings at 80% usage

## Integration Points

### 1. Dashboard Layout
```tsx
<DashboardShell>
  <QuickActionCenter userId={session.user.id} />
  <div className="grid gap-4">
    <DocumentsOverview />
    <UsageCircles metrics={usageMetrics} />
  </div>
</DashboardShell>
```

### 2. Data Flow
1. User session → Dashboard
2. Dashboard → Usage metrics
3. Metrics → Usage circles
4. User actions → Quick action center

## Design System Integration
1. Colors from tailwind.config.js
2. Icons from lucide-react
3. UI components from shadcn/ui
4. Consistent spacing and typography

## Error Handling
1. Loading states
2. Empty states
3. Error boundaries
4. Fallback UI

## Testing Requirements
1. Component unit tests
2. Integration tests
3. Visual regression tests
4. Accessibility tests

## Documentation Requirements
1. Component stories
2. Props documentation
3. Usage examples
4. Migration guides

## Status: READY FOR IMPLEMENTATION
Priority: High - Core Dashboard Functionality

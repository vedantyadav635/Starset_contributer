# Code Review Checklist

> Last Updated: 2026-09-14

## For the Reviewer

Use this checklist when reviewing pull requests:

### Correctness
- [ ] Code does what the PR description says
- [ ] Edge cases handled (empty states, null values, errors)
- [ ] No obvious bugs or logic errors
- [ ] Async operations properly awaited

### TypeScript
- [ ] No `any` types (use `unknown` if needed)
- [ ] Interfaces/types used for props and state
- [ ] No `// @ts-ignore` or `// @ts-expect-error`
- [ ] Enums used where appropriate

### Design System
- [ ] Uses design tokens (no hardcoded colors, sizes, fonts)
- [ ] Dark mode works correctly
- [ ] Responsive at 320px, 768px, 1280px
- [ ] Consistent with existing component patterns

### Security
- [ ] No secrets or credentials in code
- [ ] User input is validated
- [ ] Auth checks present on new endpoints
- [ ] No XSS vectors (user content properly escaped)

### Performance
- [ ] No unnecessary re-renders
- [ ] Large lists virtualized (if applicable)
- [ ] Images optimized and lazy-loaded
- [ ] No blocking operations in render path

### Code Quality
- [ ] Single responsibility (component/function does one thing)
- [ ] No duplicated logic (extract to utility/hook)
- [ ] Comments explain "why", not "what"
- [ ] Unused imports/variables removed

### Accessibility
- [ ] Interactive elements keyboard-accessible
- [ ] Appropriate ARIA labels
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader friendly

### Testing
- [ ] Tested manually in browser
- [ ] Error states verified
- [ ] Loading states present
- [ ] Empty states handled

## Approval Criteria

| Change Size | Required Approvals |
|-------------|-------------------|
| Trivial (typo, formatting) | 0 (self-merge okay) |
| Small (< 100 lines) | 1 |
| Medium (100–500 lines) | 1 |
| Large (> 500 lines) | 2 |
| Architecture change | 2 + team discussion |

# Error Codes & Boundaries

> Last Updated: 2026-09-14

## API Error Codes

| HTTP Status | Error | Description | Client Handling |
|-------------|-------|-------------|-----------------|
| `400` | Bad Request | Invalid input, missing fields | Show form validation errors |
| `401` | Unauthorized | Missing/invalid JWT token | Redirect to login |
| `403` | Forbidden | Insufficient role (not admin) | Show "Access Denied" |
| `404` | Not Found | Resource doesn't exist | Show "Not Found" page |
| `413` | Payload Too Large | File exceeds size limit | Show upload size error |
| `429` | Too Many Requests | Rate limit exceeded | Show "Slow down" message + retry timer |
| `500` | Internal Server Error | Unhandled server error | Show generic error message |

## Error Response Shape

```typescript
// All API errors return this shape:
interface ApiError {
  error: string;  // Human-readable message
}
```

## Client Error Handling Patterns

### API Call Pattern
```typescript
try {
  const response = await fetch(API_ENDPOINTS.CONTRIBUTOR_TASKS, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || `Request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
} catch (err) {
  // Handle network errors, parse errors, and API errors
  console.error('API Error:', err);
  throw err;
}
```

### Auth Error Recovery
```typescript
// If 401 received, session may be expired
if (response.status === 401) {
  const { data: { session } } = await supabase.auth.refreshSession();
  if (!session) {
    // Force re-login
    await supabase.auth.signOut();
    navigate('/login');
  }
}
```

## Common Error Scenarios

### Authentication Errors

| Scenario | Error | Recovery |
|----------|-------|----------|
| Token expired | 401 | Auto-refresh via Supabase SDK |
| Invalid credentials | 400 | Show login error |
| Email not confirmed | 400 | Show "Check your email" message |
| Account disabled | 403 | Show "Account suspended" |

### Submission Errors

| Scenario | Error | Recovery |
|----------|-------|----------|
| Task at capacity | 400 `"Task has reached maximum submissions"` | Disable submit button |
| Invalid file format | 400 `"Unsupported file type"` | Show format requirements |
| File too large | 413 | Show size limit |
| Duplicate submission | 400 `"Already submitted"` | Redirect to dashboard |
| Audio too short | 400 `"Audio must be at least 3 seconds"` | Show minimum duration |

### Network Errors

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| Server down | `fetch` throws `TypeError` | Show "Server unavailable" + retry button |
| Slow connection | Request timeout | Show loading state + retry |
| Offline | `navigator.onLine === false` | Show offline banner |

## Logging Strategy

### Client (Browser Console)

```typescript
// Info: Normal operations
console.info('Task loaded:', taskId);

// Warn: Recoverable issues
console.warn('⚠️ VITE_SUPABASE_URL is not set');

// Error: Failures requiring attention
console.error('Submission failed:', error);
```

### Server (stdout)

```typescript
// Structured logging (recommended)
console.log(JSON.stringify({
  level: 'error',
  message: 'Submission validation failed',
  taskId,
  userId,
  reason: error.message,
  timestamp: new Date().toISOString(),
}));
```

> 💡 **Future:** Consider structured logging with `pino` or `winston` for production.

# Code Conventions

## Prettier Defaults

We strictly follow Prettier's default configuration:

- Print Width: 80
- Tab Width: 2
- Use Tabs: false
- Semi: true
- Single Quote: false
- Quote Props: "as-needed"
- JSX Single Quote: false
- Trailing Comma: "es5"
- Bracket Spacing: true
- Bracket Same Line: false
- Arrow Function Parentheses: "always"
- End of Line: "lf"
- Embedded Language Formatting: "auto"

## TypeScript & Documentation

### TypeScript Requirements

- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- No implicit any (`noImplicitAny: true`)
- Strict null checks (`strictNullChecks: true`)
- Use type annotations for all public APIs
- Prefer `interface` over `type` for object definitions
- Use readonly where possible

### TSDoc Standards

- All public APIs must have TSDoc comments
- Use `@param` for all parameters
- Use `@returns` for return values
- Use `@throws` for documented exceptions
- Use `@example` for complex functions
- Format:
  ````typescript
  /**
   * Description of what the function does
   * @param paramName - Parameter description
   * @returns Description of return value
   * @throws {ErrorType} When and why it throws
   * @example
   * ```typescript
   * const result = functionName(param);
   * ```
   */
  ````

## File Organization

- One class per file
- File names should match class names
- Group related files in feature-specific directories
- Use index.ts files for cleaner exports

## Imports & Exports

- Use absolute imports with `@/` prefix
- Group and sort imports:
  1. External libraries
  2. Internal modules
  3. Types and interfaces
- Export one item per file as default when possible

## Error Handling

- Use typed errors with discriminated unions
- Avoid throwing errors in library code
- Document expected errors in TSDoc comments
- Provide meaningful error messages

## Naming Conventions

- PascalCase: classes, interfaces, types, enums
- camelCase: functions, properties, variables, methods
- UPPER_SNAKE_CASE: constants, enum values

## Version Control

### Commit Messages

- Write in English
- Follow conventional commits format:

  ```
  Title: [descriptive title about changes]

  [optional body]
  ```

- Types:
  - feature: New feature
  - fix: Bug fix
  - docs: Documentation changes
  - style: Code style changes
  - refactor: Code refactoring
  - test: Test changes
  - chore: Build/maintenance changes

### Branch Strategy

- Single developer project: work directly on main
- Create tags for releases using semantic versioning:
  - Major.Minor.Patch (e.g., v1.0.0)
  - Major: Breaking changes
  - Minor: New features
  - Patch: Bug fixes

### Version Control Best Practices

- Commit early and often
- Keep commits focused and atomic
- Write meaningful commit messages
- Tag all releases
- Keep main branch stable

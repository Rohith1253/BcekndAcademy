import type { RealLessonDefinition } from "./all-lessons-content";

// Helper generator function to construct complete, structured educational lessons & 5 quiz questions per lesson
function makeLesson(
  courseSlug: string,
  moduleId: number,
  moduleName: string,
  moduleSlug: string,
  order: number,
  slug: string,
  title: string,
  description: string,
  category: string,
  difficulty: "beginner" | "intermediate" | "advanced",
  duration: number,
  xpReward: number,
  learningPoints: string[],
  mainTopic: string,
  codeSnippet: string,
  quizQuestionsData: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>
): RealLessonDefinition {
  return {
    slug,
    title,
    description,
    category,
    difficulty,
    duration,
    xpReward,
    moduleId,
    moduleName,
    moduleSlug,
    order,
    learningPoints,
    content: [
      {
        type: "heading",
        level: 1,
        content: `${title}: Comprehensive Backend Masterclass`,
      },
      {
        type: "paragraph",
        content: description,
      },
      {
        type: "practice",
        items: learningPoints,
      },
      {
        type: "heading",
        level: 2,
        content: `Core Concepts & Architecture: ${mainTopic}`,
      },
      {
        type: "paragraph",
        content: `Mastering ${mainTopic} requires understanding both runtime behavior and architectural trade-offs. In production systems, clean abstractions prevent subtle bugs, reduce technical debt, and ensure maintainable codebase progression.`,
      },
      {
        type: "code",
        filename: `${slug}-example.ts`,
        language: "typescript",
        code: codeSnippet,
      },
      {
        type: "tip",
        title: "Industry Best Practices",
        content: `Always write type-safe, explicit code. In backend engineering, runtime validation combined with compile-time type checks prevents production outages and simplifies team collaboration.`,
      },
      {
        type: "warning",
        title: "Common Mistakes to Avoid",
        content: `Avoid suppressing compiler warnings or using dynamic fallback types like 'any'. Always handle error edge cases explicitly rather than swallowing exceptions.`,
      },
    ],
    quiz: quizQuestionsData.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correct: q.correct,
      correctOptionIndex: q.correct,
      explanation: q.explanation,
    })),
  };
}

export const ADDITIONAL_COURSES_LESSONS: RealLessonDefinition[] = [
  // =========================================================================
  // COURSE 2: TypeScript for Backend Development (12 Lessons)
  // =========================================================================
  // Module 1: TypeScript Fundamentals
  makeLesson(
    "typescript-backend", 1, "TypeScript Fundamentals", "ts-fundamentals", 1,
    "ts-basics-inference", "TypeScript Basics & Type Inference",
    "Understand static type checking, V8 execution, type inference, and primitive types in backend applications.",
    "TypeScript", "beginner", 30, 150,
    ["Static vs Dynamic Typing", "Type Inference Rules", "Primitive Types", "strictNullChecks Compiler Flag"],
    "Type System Foundations",
    `const port: number = Number(process.env.PORT) || 3000;\nconst serverName: string = "Production-API";\nlet isHealthy: boolean = true;\n\nconsole.log(\`Server \${serverName} listening on port \${port}\`);`,
    [
      { id: "ts1-q1", question: "What is the primary benefit of TypeScript over plain JavaScript in backend engineering?", options: ["Faster execution speed in V8", "Compile-time type safety and early bug detection", "Automatic database indexing", "Built-in HTML rendering"], correct: 1, explanation: "TypeScript catches type mismatches at compile time before execution." },
      { id: "ts1-q2", question: "What does Type Inference mean in TypeScript?", options: ["Manually writing type annotations for every variable", "The compiler automatically infers variable types based on initialized values", "Converting strings to numbers at runtime", "Disabling strict mode"], correct: 1, explanation: "Type inference lets TypeScript determine types without explicit annotations." },
      { id: "ts1-q3", question: "Which compiler flag prevents `null` and `undefined` from being assigned to non-nullable types?", options: ["noImplicitAny", "strictNullChecks", "target", "moduleResolution"], correct: 1, explanation: "`strictNullChecks` forces explicit handling of null/undefined." },
      { id: "ts1-q4", question: "What command compiles TypeScript code (`tsconfig.json`) into JavaScript?", options: ["node index.ts", "tsc", "npm run format", "ts-clean"], correct: 1, explanation: "`tsc` executes the TypeScript compiler." },
      { id: "ts1-q5", question: "Which type represents values that never occur, such as a function that throws an infinite loop or exception?", options: ["void", "any", "never", "unknown"], correct: 2, explanation: "`never` represents values that can never be observed." }
    ]
  ),
  makeLesson(
    "typescript-backend", 1, "TypeScript Fundamentals", "ts-fundamentals", 2,
    "ts-interfaces-types", "Interfaces, Types & Union Types",
    "Model application data structures using Interfaces, Type Aliases, and Union types for type safety.",
    "TypeScript", "beginner", 30, 150,
    ["Interface declaration vs Type alias", "Union & Intersection types", "Readonly properties", "Optional fields"],
    "Data Modeling Contracts",
    `export interface UserDTO {\n  readonly id: string;\n  name: string;\n  email: string;\n  role: 'admin' | 'user' | 'guest';\n  phoneNumber?: string;\n}`,
    [
      { id: "ts2-q1", question: "What is the key feature of a TypeScript Interface?", options: ["It compiles to a JS object at runtime", "It defines a shape contract for objects at compile time", "It executes database queries", "It parses JSON strings"], correct: 1, explanation: "Interfaces define object shape contracts without generating JS code." },
      { id: "ts2-q2", question: "How do you mark an interface property as optional?", options: ["property!", "property?", "optional property", "property: optional"], correct: 1, explanation: "Adding `?` after property name marks it as optional." },
      { id: "ts2-q3", question: "What does a Union Type `'admin' | 'user'` enforce?", options: ["The string must equal either 'admin' or 'user'", "The property accepts any string", "The property must be an array", "It combines both objects"], correct: 0, explanation: "Union types restrict values to specified options." },
      { id: "ts2-q4", question: "What keyword prevents modification of an interface property after creation?", options: ["const", "readonly", "static", "sealed"], correct: 1, explanation: "`readonly` enforces immutability on properties." },
      { id: "ts2-q5", question: "Can Interfaces be extended using the `extends` keyword?", options: ["No, only classes can extend", "Yes, interfaces can inherit from other interfaces", "Only in browser code", "Only with any type"], correct: 1, explanation: "Interfaces support single and multiple inheritance using `extends`." }
    ]
  ),
  makeLesson(
    "typescript-backend", 1, "TypeScript Fundamentals", "ts-fundamentals", 3,
    "ts-generics-functions", "Functions, Generics & Type Safety",
    "Write reusable, type-safe utility functions and generic response wrappers for API handlers.",
    "TypeScript", "beginner", 35, 150,
    ["Generic Functions `<T>`", "Generic Constraints `extends`", "Typed Higher-Order Functions", "API Envelope Wrappers"],
    "Generic Abstractions",
    `export interface APIResponse<T> {\n  success: boolean;\n  data: T;\n  timestamp: string;\n}\n\nexport function createResponse<T>(data: T): APIResponse<T> {\n  return { success: true, data, timestamp: new Date().toISOString() };\n}`,
    [
      { id: "ts3-q1", question: "What is the main purpose of Generics `<T>` in TypeScript?", options: ["To speed up execution runtime", "To create reusable components/functions that work over a variety of types while retaining type safety", "To bypass compiler type checks", "To format console logs"], correct: 1, explanation: "Generics allow parameterized type definitions without losing safety." },
      { id: "ts3-q2", question: "How do you constrain a Generic type parameter to only accept types extending an interface?", options: ["<T implements Interface>", "<T extends Interface>", "<T = Interface>", "<T in Interface>"], correct: 1, explanation: "The `extends` keyword constrains type parameters." },
      { id: "ts3-q3", question: "What does function return type `void` signify?", options: ["The function returns null", "The function returns no value", "The function throws an error", "The function returns an object"], correct: 1, explanation: "`void` indicates a function does not return a value." },
      { id: "ts3-q4", question: "What is a Higher-Order Function in TypeScript?", options: ["A function that accepts or returns another function", "A function with more than 10 lines", "A static method", "A database query"], correct: 0, explanation: "Higher-order functions take or return other functions." },
      { id: "ts3-q5", question: "In `APIResponse<T>`, what is `T` referred to as?", options: ["Class variable", "Type Parameter", "Macro name", "Interface string"], correct: 1, explanation: "`T` is a generic Type Parameter placeholder." }
    ]
  ),

  // Module 2: Advanced TypeScript
  makeLesson(
    "typescript-backend", 2, "Advanced TypeScript", "advanced-ts", 1,
    "ts-classes-oop", "Classes & Object-Oriented Design Patterns",
    "Implement Object-Oriented Programming (OOP) with private/public modifiers, dependency injection, and abstract classes.",
    "TypeScript", "intermediate", 35, 150,
    ["Access Modifiers (public, private, protected)", "Constructor Shorthand Properties", "Abstract Classes", "Dependency Injection Pattern"],
    "OOP Architecture",
    `export abstract class BaseService {\n  constructor(protected readonly serviceName: string) {}\n  abstract execute(): Promise<void>;\n}`,
    [
      { id: "ts4-q1", question: "Which access modifier restricts property visibility ONLY to the defining class?", options: ["public", "protected", "private", "readonly"], correct: 2, explanation: "`private` members cannot be accessed outside the defining class." },
      { id: "ts4-q2", question: "Which access modifier allows access within the defining class AND child derived classes?", options: ["public", "protected", "private", "internal"], correct: 1, explanation: "`protected` grants access to subclasses." },
      { id: "ts4-q3", question: "What is an Abstract Class?", options: ["A class that cannot be directly instantiated and requires subclass implementation", "A class without any methods", "A class converted to JSON", "A global singleton"], correct: 0, explanation: "Abstract classes serve as base classes and cannot be instantiated directly." },
      { id: "ts4-q4", question: "How does TypeScript parameter properties syntax (`constructor(private db: Database)`) help clean code?", options: ["Automatically initializes and assigns property `db` in one line", "Connects to database", "Deletes redundant code at runtime", "Compiles faster"], correct: 0, explanation: "Parameter properties declare and assign constructor args in one step." },
      { id: "ts4-q5", question: "What is Dependency Injection in backend service architecture?", options: ["Injecting SQL code into inputs", "Passing required dependencies (e.g. Repositories) into class constructors rather than instantiating them inside", "Importing npm packages", "Restarting Node.js processes"], correct: 1, explanation: "Dependency Injection passes dependencies into class constructors for testability." }
    ]
  ),
  makeLesson(
    "typescript-backend", 2, "Advanced TypeScript", "advanced-ts", 2,
    "ts-utility-types", "Utility Types & Type Manipulation",
    "Master built-in utility types: Partial, Required, Readonly, Record, Pick, Omit, and ReturnType.",
    "TypeScript", "intermediate", 35, 150,
    ["Partial<T> and Required<T>", "Pick<T, K> and Omit<T, K>", "Record<K, V>", "ReturnType<T>"],
    "Type Manipulation",
    `export interface User {\n  id: string;\n  email: string;\n  name: string;\n  passwordHash: string;\n}\n\n// Update payload allows partial fields except id\nexport type UpdateUserDTO = Partial<Omit<User, 'id' | 'passwordHash'>>;`,
    [
      { id: "ts5-q1", question: "What does `Partial<T>` do to an interface `T`?", options: ["Makes all properties optional (`?`)", "Makes all properties required", "Deletes all properties", "Makes all properties readonly"], correct: 0, explanation: "`Partial<T>` makes every property optional." },
      { id: "ts5-q2", question: "Which utility type constructs a type by choosing specified keys `K` from type `T`?", options: ["Omit<T, K>", "Pick<T, K>", "Extract<T, K>", "Exclude<T, K>"], correct: 1, explanation: "`Pick<T, K>` selects specific properties from `T`." },
      { id: "ts5-q3", question: "Which utility type constructs a type by removing specified keys `K` from type `T`?", options: ["Omit<T, K>", "Pick<T, K>", "Partial<T>", "Readonly<T>"], correct: 0, explanation: "`Omit<T, K>` excludes specific keys." },
      { id: "ts5-q4", question: "What type does `Record<string, number>` create?", options: ["An array of numbers", "An object with string keys and number values", "A tuple of 2 elements", "A Set string"], correct: 1, explanation: "`Record<K, V>` creates an object type mapping keys K to values V." },
      { id: "ts5-q5", question: "What does `ReturnType<typeof myFunction>` extract?", options: ["The argument types of myFunction", "The return type of function myFunction", "The function name string", "The file path"], correct: 1, explanation: "`ReturnType` obtains the return type of a function." }
    ]
  ),
  makeLesson(
    "typescript-backend", 2, "Advanced TypeScript", "advanced-ts", 3,
    "ts-narrowing-guards", "Type Narrowing, Guards & Discriminated Unions",
    "Safely handle polymorphic data using type guards (`typeof`, `instanceof`, user-defined `is`), and Discriminated Unions.",
    "TypeScript", "intermediate", 35, 150,
    ["Type Narrowing (`typeof`, `instanceof`)", "Custom Type Guard Functions (`val is Target`)", "Discriminated Union Tagging", "Exhaustiveness Checking with `never`"],
    "Type Guards & Unions",
    `type NetworkState = \n  | { status: 'loading' }\n  | { status: 'success'; data: string }\n  | { status: 'error'; error: Error };\n\nfunction handleState(state: NetworkState) {\n  switch (state.status) {\n    case 'loading': return 'Spinner';\n    case 'success': return state.data;\n    case 'error': return state.error.message;\n  }\n}`,
    [
      { id: "ts6-q1", question: "What is Type Narrowing in TypeScript?", options: ["Reducing font size of type annotations", "Refining a broad type to a more specific type using conditional logic checks", "Deleting unused types", "Converting TypeScript to C++"], correct: 1, explanation: "Narrowing refines broad union types to specific concrete types." },
      { id: "ts6-q2", question: "What is the syntax for a custom User-Defined Type Guard function return type?", options: ["boolean", "val is TargetType", "asserts val", "typeOf Target"], correct: 1, explanation: "`parameterName is Type` defines custom guard signatures." },
      { id: "ts6-q3", question: "What makes a Union a 'Discriminated Union'?", options: ["It uses numbers only", "Every member contains a common literal property (tag) used to distinguish variants", "It contains duplicate keys", "It cannot be used in switch statements"], correct: 1, explanation: "A shared literal tag property allows TypeScript to narrow variant members." },
      { id: "ts6-q4", question: "Which operator checks if an object is an instance of a specific Class constructor at runtime?", options: ["typeof", "instanceof", "is", "in"], correct: 1, explanation: "`instanceof` tests class prototype chain membership." },
      { id: "ts6-q5", question: "How do you achieve compile-time Exhaustiveness Checking in a `switch` statement for Discriminated Unions?", options: ["Assigning default case to `const _exhaustiveCheck: never = caseValue;`", "Adding a comment", "Using try/catch", "Returning null"], correct: 0, explanation: "Assigning unhandled union cases to type `never` causes a compile error if a case is missed." }
    ]
  ),

  // Module 3: TypeScript for Node.js
  makeLesson(
    "typescript-backend", 3, "TypeScript for Node.js", "ts-nodejs", 1,
    "ts-node-setup", "TypeScript Node.js Project Setup & tsconfig.json",
    "Configure production `tsconfig.json`, `ts-node-dev`, `tsx`, build output directories (`dist/`), and path aliases.",
    "TypeScript", "intermediate", 35, 150,
    ["tsconfig.json Compiler Options", "target, module, moduleResolution", "rootDir and outDir", "Path Aliases (`@/*`)"],
    "Project Setup",
    `// tsconfig.json\n{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "strict": true,\n    "esModuleInterop": true\n  }\n}`,
    [
      { id: "ts7-q1", question: "What does the `outDir` setting in `tsconfig.json` specify?", options: ["The folder where compiled `.js` output files are generated", "The source folder containing `.ts` files", "The node_modules directory", "The log file destination"], correct: 0, explanation: "`outDir` dictates the target build directory (e.g. `./dist`)." },
      { id: "ts7-q2", question: "Which `tsconfig.json` option enables all strict type-checking flags (`strictNullChecks`, `noImplicitAny`, etc.)?", options: ["\"strict\": true", "\"checkJs\": true", "\"allowSyntheticDefaultImports\": true", "\"noEmit\": false"], correct: 0, explanation: "`\"strict\": true` activates comprehensive type checking rules." },
      { id: "ts7-q3", question: "Why is `@types/node` installed as a devDependency in TypeScript Node projects?", options: ["It provides TypeScript declaration definitions for Node.js core modules (fs, path, http)", "It speeds up V8 compiler", "It installs Express framework", "It creates database tables"], correct: 0, explanation: "@types/node supplies type signatures for Node.js runtime globals." },
      { id: "ts7-q4", question: "What tool allows running TypeScript files directly in development without manual `tsc` compilation steps?", options: ["tsx or ts-node", "npm format", "webpack", "babel-cli"], correct: 0, explanation: "`tsx` and `ts-node` execute TypeScript code directly in development." },
      { id: "ts7-q5", question: "What does `esModuleInterop: true` permit in `tsconfig.json`?", options: ["Importing CommonJS modules using ES6 default import syntax (`import express from 'express'`)", "Combining C++ with Python", "Running code on browsers", "Disabling strict mode"], correct: 0, explanation: "`esModuleInterop` emits helper code for seamless default imports from CommonJS modules." }
    ]
  ),
  makeLesson(
    "typescript-backend", 3, "TypeScript for Node.js", "ts-nodejs", 2,
    "ts-async-typed-apis", "Async Programming & Typed Express APIs",
    "Type Express Request, Response, and NextFunction objects safely with generic request params, query, and body.",
    "TypeScript", "intermediate", 35, 150,
    ["Typed Express Route Handlers", "Request<Params, ResBody, ReqBody, ReqQuery>", "Async/Await Exception Wrapper", "Express Request Declaration Merging"],
    "Typed API Handlers",
    `import { Request, Response } from 'express';\n\ninterface CreateUserReqBody {\n  name: string;\n  email: string;\n}\n\nexport const createUser = async (\n  req: Request<{}, {}, CreateUserReqBody>,\n  res: Response\n) => {\n  const { name, email } = req.body; // Strongly typed!\n  res.status(201).json({ success: true, data: { name, email } });\n};`,
    [
      { id: "ts8-q1", question: "What are the generic parameters of Express `Request<P, ResBody, ReqBody, ReqQuery>` in `@types/express`?", options: ["<Params, ResponseBody, RequestBody, RequestQuery>", "<URL, Header, Body, Cookie>", "<Client, Server, DB, Port>", "<Get, Post, Put, Delete>"], correct: 0, explanation: "`Request` generic signature accepts Params, ResBody, ReqBody, and ReqQuery types in order." },
      { id: "ts8-q2", question: "How do you extend the global Express `Request` interface to add custom properties (like `req.user`)?", options: ["Declaration Merging (`declare global { namespace Express { interface Request { user?: User; } } }`)", "Editing node_modules directly", "Using any type in controller", "Adding comments"], correct: 0, explanation: "Declaration merging cleanly extends third-party module interfaces." },
      { id: "ts8-q3", question: "What is the return type of an `async` function in TypeScript?", options: ["Promise<T>", "void", "T directly", "Response"], correct: 0, explanation: "Async functions always return a `Promise` wrapping their result type." },
      { id: "ts8-q4", question: "Why is typing `req.body` explicitly important in POST/PUT controllers?", options: ["It prevents runtime crashes by enforcing valid property types and autocomplete", "It encrypts the payload", "It sends emails automatically", "It formats HTML"], correct: 0, explanation: "Strongly typed body interfaces prevent accessing non-existent properties." },
      { id: "ts8-q5", question: "What happens if an unhandled promise rejection occurs inside an async route handler without try/catch or async handler wrapper?", options: ["Express crashes or hangs without returning a response", "TypeScript automatically fixes the error", "Database is reset", "Status 200 is sent"], correct: 0, explanation: "Uncaught async errors bypass standard sync middleware unless caught and forwarded to `next(err)`." }
    ]
  ),
  makeLesson(
    "typescript-backend", 3, "TypeScript for Node.js", "ts-nodejs", 3,
    "ts-env-config", "Typed Environment Variables & Configuration",
    "Safely validate and parse environment variables (`process.env`) using Zod schemas at application startup.",
    "TypeScript", "intermediate", 35, 150,
    ["Parsing `process.env`", "Zod Environment Schema Validation", "Failing Fast on Startup", "Immutable Config Singletons"],
    "Config Management",
    `import { z } from 'zod';\nimport 'dotenv/config';\n\nconst envSchema = z.object({\n  PORT: z.string().transform(Number).default("3000"),\n  MONGODB_URI: z.string().url(),\n  JWT_SECRET: z.string().min(16),\n});\n\nexport const env = envSchema.parse(process.env);`,
    [
      { id: "ts9-q1", question: "Why is validating `process.env` with a schema library (like Zod) on startup a best practice?", options: ["It ensures missing required environment variables cause the app to Fail Fast before accepting traffic", "It speeds up network requests", "It converts TypeScript to C", "It encrypts the database"], correct: 0, explanation: "Failing fast on startup prevents running in an unconfigured, vulnerable state." },
      { id: "ts9-q2", question: "What is the type of `process.env.MY_VAR` in Node.js by default?", options: ["string | undefined", "number", "boolean", "any"], correct: 0, explanation: "All `process.env` properties are `string` or `undefined`." },
      { id: "ts9-q3", question: "What does `z.string().transform(Number)` in Zod accomplish?", options: ["Parses string input and transforms it into a typed number", "Converts numbers to strings", "Throws a syntax error", "Formats date strings"], correct: 0, explanation: "Transforms parse and convert input types safely." },
      { id: "ts9-q4", question: "Why should `env` configuration objects be exported as immutable singletons?", options: ["To prevent runtime code from mutating global configuration settings", "To increase font size", "To allow duplicate keys", "To bypass authentication"], correct: 0, explanation: "Freezing/locking config objects prevents accidental mutations." },
      { id: "ts9-q5", question: "Where should `.env` files NEVER be stored?", options: ["In public Git repositories (`.gitignore` must exclude `.env`)", "On local developer machines", "In deployment environment settings", "In secure key vaults"], correct: 0, explanation: "Credentials in `.env` files must never be committed to Git repositories." }
    ]
  ),

  // Module 4: Production TypeScript
  makeLesson(
    "typescript-backend", 4, "Production TypeScript", "production-ts", 1,
    "ts-error-result-patterns", "Error Types & Result Pattern Architecture",
    "Design custom AppError classes and functional Result patterns (`Result<T, E>`) for clean error handling.",
    "TypeScript", "advanced", 40, 160,
    ["Custom `AppError` Hierarchy", "Operational vs Programmer Errors", "Result/Either Pattern", "Centralized Mapping to HTTP Statuses"],
    "Error Architecture",
    `export class AppError extends Error {\n  constructor(\n    public readonly message: string,\n    public readonly statusCode: number = 500,\n    public readonly isOperational: boolean = true\n  ) {\n    super(message);\n    Object.setPrototypeOf(this, new.target.prototype);\n  }\n}`,
    [
      { id: "ts10-q1", question: "What is an 'Operational Error' in backend engineering?", options: ["Known predictable runtime errors like invalid input or 404 not found", "Bugs in compiler code", "Hardware CPU failure", "Syntax error during build"], correct: 0, explanation: "Operational errors represent expected failure cases that should be handled gracefully." },
      { id: "ts10-q2", question: "Why is `Object.setPrototypeOf(this, new.target.prototype)` called inside custom Error constructors in TypeScript?", options: ["To fix prototype chain breaks when extending built-in Error in ES5/ES6 compilation", "To encrypt stack trace", "To print logs in green", "To restart server"], correct: 0, explanation: "Restoring the prototype chain ensures `instanceof AppError` checks work correctly." },
      { id: "ts10-q3", question: "What is the main concept of the Result pattern (`{ ok: true, value } | { ok: false, error }`)?", options: ["Returning explicit result objects instead of throwing unhandled exceptions", "Using database transactions only", "Printing console tables", "Deleting error logs"], correct: 0, explanation: "Result patterns turn error handling into explicit type-checked return values." },
      { id: "ts10-q4", question: "What HTTP status should an operational `NotFoundError` extend?", options: ["404 Not Found", "500 Internal Error", "200 OK", "401 Unauthorized"], correct: 0, explanation: "Missing resources map to HTTP 404." },
      { id: "ts10-q5", question: "Why should internal database stack traces be hidden from API responses in production?", options: ["To prevent information disclosure security vulnerabilities", "To save bandwidth", "To comply with CSS rules", "To speed up V8"], correct: 0, explanation: "Exposing stack traces leaks internal implementation details to attackers." }
    ]
  ),
  makeLesson(
    "typescript-backend", 4, "Production TypeScript", "production-ts", 2,
    "ts-dtos-validation", "API Data Transfer Objects (DTOs) & Zod Validation",
    "Validate incoming HTTP request payloads using DTO classes and Zod runtime schema inference.",
    "TypeScript", "advanced", 40, 160,
    ["Data Transfer Object (DTO) Pattern", "Zod Schema Definition", "Inferring TypeScript Types (`z.infer<typeof schema>`)", "Validation Middleware Layer"],
    "DTO & Validation",
    `import { z } from 'zod';\n\nexport const createUserSchema = z.object({\n  body: z.object({\n    name: z.string().min(2),\n    email: z.string().email(),\n    password: z.string().min(8),\n  }),\n});\n\nexport type CreateUserDTO = z.infer<typeof createUserSchema>['body'];`,
    [
      { id: "ts11-q1", question: "What does DTO stand for in backend architecture?", options: ["Data Transfer Object", "Database Table Option", "Direct Transfer Operation", "Domain Type Operator"], correct: 0, explanation: "DTOs define the exact object structure transferred between client and server layers." },
      { id: "ts11-q2", question: "How do you generate a TypeScript interface automatically from a Zod schema `mySchema`?", options: ["type MyType = z.infer<typeof mySchema>;", "type MyType = typeof mySchema;", "interface MyType = z.get<mySchema>;", "mySchema.toType()"], correct: 0, explanation: "`z.infer<typeof schema>` extracts static TypeScript types directly from runtime schemas." },
      { id: "ts11-q3", question: "Where should DTO input validation take place in an Express application?", options: ["In a middleware layer before controller execution", "Inside the MongoDB database engine", "In CSS files", "After sending response to client"], correct: 0, explanation: "Validating input in middleware rejects invalid requests before reaching business controllers." },
      { id: "ts11-q4", question: "What status code should be returned when Zod validation fails on client input?", options: ["400 Bad Request", "500 Server Error", "204 No Content", "403 Forbidden"], correct: 0, explanation: "HTTP 400 Bad Request indicates client validation failure." },
      { id: "ts11-q5", question: "Why is validating inputs at runtime necessary even with static TypeScript checking?", options: ["TypeScript types are erased at compile time; runtime JS cannot verify external client JSON without runtime validation", "TypeScript makes code slower", "Database requires string inputs", "It is optional"], correct: 0, explanation: "Types are erased during compilation, so incoming client JSON payloads must be validated at runtime." }
    ]
  ),
  makeLesson(
    "typescript-backend", 4, "Production TypeScript", "production-ts", 3,
    "ts-architecture-patterns", "Production TypeScript Project Architecture",
    "Organize enterprise TypeScript backends into Layered Architecture: Controllers, Services, Repositories, and Models.",
    "TypeScript", "advanced", 40, 160,
    ["Layered / Clean Architecture", "Controllers vs Services vs Repositories", "Inversion of Control", "Production Build & Deployment Pipeline"],
    "Clean Architecture",
    `// Router -> Controller -> Service -> Repository -> Database\nexport class UserService {\n  constructor(private readonly userRepo: UserRepository) {}\n\n  async registerUser(dto: CreateUserDTO) {\n    const existing = await this.userRepo.findByEmail(dto.email);\n    if (existing) throw new ConflictError("Email already registered");\n    return this.userRepo.create(dto);\n  }\n}`,
    [
      { id: "ts12-q1", question: "In Layered Architecture, what is the primary role of the Service Layer?", options: ["Containing business logic and orchestrating domain workflows", "Parsing HTTP request headers", "Executing raw SQL queries", "Styling HTML"], correct: 0, explanation: "The Service layer encapsulates domain business rules decoupled from HTTP delivery layers." },
      { id: "ts12-q2", question: "What is the primary responsibility of the Repository Layer?", options: ["Abstracting database persistence and data access operations", "Sending HTTP responses", "Handling route paths", "Parsing cookies"], correct: 0, explanation: "Repositories isolate database CRUD operations from business logic." },
      { id: "ts12-q3", question: "Why is decoupling Controller logic from Service logic beneficial?", options: ["It allows reusing business services across different triggers (REST, gRPC, CLI, WebSockets)", "It makes JS files smaller", "It removes need for TypeScript", "It hides database errors"], correct: 0, explanation: "Separating HTTP handlers from domain logic makes services reusable and easily unit-testable." },
      { id: "ts12-q4", question: "What command generates clean production JavaScript files in `dist/`?", options: ["tsc", "node start", "npm test", "git commit"], correct: 0, explanation: "`tsc` compiles TypeScript source into production JS." },
      { id: "ts12-q5", question: "Which node command runs production builds from compiled JS files?", options: ["node dist/server.js", "tsc --watch", "npm run dev", "ts-node src/server.ts"], correct: 0, explanation: "Production servers execute compiled JS files directly via `node dist/server.js`." }
    ]
  ),

  // =========================================================================
  // COURSE 3: REST API Development with Express.js (12 Lessons)
  // =========================================================================
  makeLesson(
    "express-rest-api", 1, "Express Foundations", "express-foundations", 1,
    "express-server-architecture", "Express Server Architecture & Bootstrap",
    "Structure production Express servers with graceful shutdowns, environment configs, and HTTP listeners.",
    "Express", "intermediate", 35, 150,
    ["Express App Initialization", "Environment Bootstrapping", "SIGTERM & SIGINT Graceful Shutdown", "Health Checks"],
    "Express Server Architecture",
    `import express from 'express';\nimport http from 'http';\n\nconst app = express();\nconst server = http.createServer(app);\n\nprocess.on('SIGTERM', () => {\n  console.log('SIGTERM received. Closing HTTP server gracefully...');\n  server.close(() => process.exit(0));\n});`,
    [
      { id: "ex13-q1", question: "What signal does container orchestrators (like Kubernetes/Docker) send when shutting down a Node.js process?", options: ["SIGTERM", "SIGKILL", "SIGINT", "SIGHUP"], correct: 0, explanation: "SIGTERM is sent to request a graceful application shutdown." },
      { id: "ex13-q2", question: "Why is Graceful Shutdown essential in backend engineering?", options: ["To finish processing active HTTP requests and close DB connection pools cleanly before exiting", "To clear browser cache", "To delete log files", "To format TypeScript"], correct: 0, explanation: "Graceful shutdown prevents dropping active in-flight user connections during deployments." },
      { id: "ex13-q3", question: "What endpoint is standard for monitoring server uptime and load balancer health?", options: ["GET /api/health", "POST /api/delete", "GET /admin", "PUT /status"], correct: 0, explanation: "Health check endpoints allow load balancers to verify service availability." },
      { id: "ex13-q4", question: "Which method mounts application middleware in Express?", options: ["app.use()", "app.bind()", "app.apply()", "app.add()"], correct: 0, explanation: "`app.use()` registers middleware functions in the request pipeline." },
      { id: "ex13-q5", question: "What happens if a process crashes on uncaught exception without a process supervisor (PM2/Docker)?", options: ["The Node.js process terminates immediately", "Node.js restarts automatically without configuration", "The browser reloads", "Logs are emailed"], correct: 0, explanation: "Uncaught exceptions terminate Node.js processes; process managers are required to restart them." }
    ]
  ),
  makeLesson(
    "express-rest-api", 1, "Express Foundations", "express-foundations", 2,
    "express-routing-controllers", "Routing, Controllers & Express Router",
    "Organize API endpoints with modular express.Router() instances and decoupled Controller methods.",
    "Express", "intermediate", 35, 150,
    ["express.Router() modularity", "Controller methods signature", "Param extraction", "Response envelopes"],
    "Routing & Controllers",
    `import { Router } from 'express';\n\nconst router = Router();\nrouter.get('/products', (req, res) => res.json({ success: true, data: [] }));\nexport default router;`,
    [
      { id: "ex14-q1", question: "What is the primary role of `express.Router()`?", options: ["To create isolated, modular route handlers that can be mounted into the main app", "To parse cookies", "To connect to MongoDB", "To hash passwords"], correct: 0, explanation: "Routers break down monolithic API definitions into modular route files." },
      { id: "ex14-q2", question: "How do you extract URL parameter `:productId` from `/api/products/:productId`?", options: ["req.params.productId", "req.query.productId", "req.body.productId", "req.headers.productId"], correct: 0, explanation: "Route path parameters are accessed via `req.params`." },
      { id: "ex14-q3", question: "How do you extract query parameter `?sort=asc`?", options: ["req.query.sort", "req.params.sort", "req.body.sort", "req.url.sort"], correct: 0, explanation: "Query strings are parsed into `req.query`." },
      { id: "ex14-q4", question: "What is the benefit of a standardized Response Envelope (`{ success, data, error }`)?", options: ["It provides predictable API response structure for frontend clients", "It speeds up network speed", "It compresses text", "It formats dates"], correct: 0, explanation: "Envelopes standardize success and error payloads across all endpoints." },
      { id: "ex14-q5", question: "Which method sends a JSON HTTP response in Express?", options: ["res.json()", "res.sendJSON()", "res.writeJSON()", "res.output()"], correct: 0, explanation: "`res.json()` serializes data and sets Content-Type to application/json." }
    ]
  ),
  makeLesson(
    "express-rest-api", 1, "Express Foundations", "express-foundations", 3,
    "express-request-lifecycle", "Request & Response Lifecycle in Action",
    "Trace an incoming HTTP packet through Express parsing, middleware chain, controller execution, and client response.",
    "Express", "intermediate", 35, 150,
    ["HTTP Packet Arrival", "Body & Query Parsing", "Middleware Execution Chain", "Response Sent & Stream Termination"],
    "Request Lifecycle",
    `app.use((req, res, next) => {\n  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);\n  next();\n});`,
    [
      { id: "ex15-q1", question: "What happens when `next()` is called inside an Express middleware?", options: ["Execution passes to the next middleware or route handler in the pipeline", "The response is sent to client", "The database closes", "The process restarts"], correct: 0, explanation: "`next()` signals Express to move to the next middleware in sequence." },
      { id: "ex15-q2", question: "What happens if a middleware sends a response (`res.json()`) AND then calls `next()`?", options: ["Express throws 'ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client'", "The request executes twice", "Nothing happens", "The server reboots"], correct: 0, explanation: "Calling `next()` after sending headers results in headers already sent errors." },
      { id: "ex15-q3", question: "In what order do Express middleware execute?", options: ["Strictly in the order they are registered via `app.use()` and route definitions", "In reverse order", "Alphabetically by file name", "Random order"], correct: 0, explanation: "Express executes middleware sequentially based on registration order." },
      { id: "ex15-q4", question: "What property on `res` checks if headers have already been sent to client?", options: ["res.headersSent", "res.sent", "res.isClosed", "res.done"], correct: 0, explanation: "`res.headersSent` is a boolean indicating response header status." },
      { id: "ex15-q5", question: "Which event fires on `res` when the client closes the connection unexpectedly?", options: ["res.on('close')", "res.on('end')", "res.on('exit')", "res.on('stop')"], correct: 0, explanation: "The `close` event signals socket disconnect." }
    ]
  ),

  // Module 2: API Architecture
  makeLesson(
    "express-rest-api", 2, "API Architecture", "api-architecture", 1,
    "rest-resource-design", "REST Resource Design & Endpoint Conventions",
    "Design resource-oriented URIs, plural collection nouns, nested endpoints, and idempotent action mapping.",
    "Express", "intermediate", 35, 150,
    ["Plural Noun URIs", "Nested Endpoints (/users/:id/orders)", "Standard CRUD Verb Mapping", "Filtering & Sorting Conventions"],
    "REST Resource Design",
    `// RESTful Resource Mapping\nGET /api/v1/orders              // List orders\nPOST /api/v1/orders             // Create order\nGET /api/v1/users/:id/orders    // Nested resource lookup`,
    [
      { id: "ex16-q1", question: "Which URI follows proper RESTful resource design for fetching comments on post `42`?", options: ["GET /api/v1/posts/42/comments", "GET /api/v1/getCommentsForPost42", "POST /api/v1/fetchPostComments?id=42", "GET /api/v1/comment/post/42"], correct: 0, explanation: "Nested plural nouns represent hierarchical resource relationships cleanly." },
      { id: "ex16-q2", question: "What HTTP verb should be used to create a new order resource?", options: ["POST", "GET", "PUT", "PATCH"], correct: 0, explanation: "POST is the standard verb for resource creation." },
      { id: "ex16-q3", question: "What HTTP verb should be used to completely replace an existing resource?", options: ["PUT", "PATCH", "POST", "OPTION"], correct: 0, explanation: "PUT performs full resource replacement." },
      { id: "ex16-q4", question: "What status code should be returned after successfully deleting a resource with no body response?", options: ["204 No Content", "200 OK", "201 Created", "404 Not Found"], correct: 0, explanation: "204 No Content indicates success with no response payload." },
      { id: "ex16-q5", question: "What query parameter convention is standard for filtering active items?", options: ["GET /api/v1/products?status=active", "GET /api/v1/products/active/filter", "POST /api/v1/filterProductsActive", "GET /api/v1/products#active"], correct: 0, explanation: "Query params are standard for filtering collections." }
    ]
  ),
  makeLesson(
    "express-rest-api", 2, "API Architecture", "api-architecture", 2,
    "validation-dto-patterns", "Validation & Data Transfer Object (DTO) Patterns",
    "Implement request validation middleware with Zod or Joi to sanitize and format data before reaching controllers.",
    "Express", "intermediate", 35, 150,
    ["Runtime Schema Validation", "Sanitizing Unwanted Fields", "Formatting Validation Errors", "DTO Mapping"],
    "Validation & DTOs",
    `import { z } from 'zod';\n\nconst createCategorySchema = z.object({\n  name: z.string().min(3).trim(),\n  description: z.string().optional()\n});`,
    [
      { id: "ex17-q1", question: "Why is validating request input in middleware before controller execution essential?", options: ["To prevent invalid data from corrupting database state or triggering runtime exceptions", "To speed up CSS rendering", "To reduce RAM usage", "To bypass auth"], correct: 0, explanation: "Middleware validation guarantees clean input contracts." },
      { id: "ex17-q2", question: "What is Mass Assignment vulnerability?", options: ["Allowing clients to pass malicious unexpected fields (like `role: 'admin'`) in request bodies that get blindly saved to DB", "Sending 100 emails at once", "Creating multiple databases", "Formatting code automatically"], correct: 0, explanation: "Mass assignment occurs when extra unvalidated body properties are saved to database documents." },
      { id: "ex17-q3", question: "How do DTO schemas prevent Mass Assignment vulnerabilities?", options: ["By explicitly stripping out unallowed fields from request bodies", "By encrypting passwords", "By restarting server", "By running SQL queries"], correct: 0, explanation: "DTO schemas pick only whitelisted fields." },
      { id: "ex17-q4", question: "What status code should a validation middleware return when client payload fails schema checks?", options: ["400 Bad Request", "500 Server Error", "200 OK", "401 Unauthorized"], correct: 0, explanation: "400 Bad Request signals client payload validation failure." },
      { id: "ex17-q5", question: "What string method should be applied to user input fields like email during validation?", options: ["trim() and lowercase()", "toUpperCase()", "reverse()", "encodeURIComponent()"], correct: 0, explanation: "Trimming whitespace and lowercasing email prevents duplicate login issues." }
    ]
  ),
  makeLesson(
    "express-rest-api", 2, "API Architecture", "api-architecture", 3,
    "centralized-error-handling", "Centralized Error Handling Architecture",
    "Construct enterprise 4-argument error middleware, custom HTTP exception classes, and safe production error responses.",
    "Express", "intermediate", 35, 150,
    ["4-Argument Error Middleware", "Custom Exception Classes (BadRequest, Unauthorized, NotFound)", "Masking Stack Traces in Production", "Async Error Handler Wrappers"],
    "Centralized Error Handling",
    `app.use((err: any, req: any, res: any, next: any) => {\n  const status = err.statusCode || 500;\n  res.status(status).json({ success: false, error: err.message });\n});`,
    [
      { id: "ex18-q1", question: "How does Express identify an Error Handling middleware?", options: ["By having exactly 4 parameters `(err, req, res, next)`", "By name 'errorHandler'", "By returning boolean", "By placing it first"], correct: 0, explanation: "Express checks function arity (`fn.length === 4`)." },
      { id: "ex18-q2", question: "Where must Error Handling middleware be placed in Express?", options: ["After all route definitions and handlers", "Before routes", "In package.json", "Inside controller loops"], correct: 0, explanation: "Error middleware must be registered last so errors fall through to it." },
      { id: "ex18-q3", question: "What does calling `next(err)` inside a route handler do?", options: ["Bypasses remaining routes and jumps directly to error middleware", "Sends 200 OK", "Restarts Node process", "Deletes database"], correct: 0, explanation: "Passing an error argument to `next()` invokes error handling middleware." },
      { id: "ex18-q4", question: "Why must internal database errors (like `MongoServerError`) be masked in production?", options: ["To prevent exposing database table structures and credentials to attackers", "To save memory", "To speed up V8", "To format HTML"], correct: 0, explanation: "Exposing raw DB errors introduces information disclosure security risks." },
      { id: "ex18-q5", question: "What is an Async Handler wrapper function used for in Express 4?", options: ["Wrapping async route functions to catch rejected promises and forward errors to `next(err)`", "Encrypting passwords", "Connecting DB", "Parsing JSON"], correct: 0, explanation: "Async handlers automatically catch promise rejections and call `next(err)`." }
    ]
  ),

  // Module 3: Production APIs
  makeLesson(
    "express-rest-api", 3, "Production APIs", "production-apis", 1,
    "api-pagination-sorting", "API Pagination, Filtering & Sorting Architecture",
    "Implement offset-based and cursor-based pagination, dynamic sorting, and response pagination metadata.",
    "Express", "intermediate", 40, 160,
    ["Offset vs Cursor Pagination", "Page & Limit Calculations", "Sorting Flags (`?sort=-createdAt`)", "Pagination Response Metadata"],
    "Pagination & Sorting",
    `const page = Math.max(1, Number(req.query.page) || 1);\nconst limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));\nconst skip = (page - 1) * limit;`,
    [
      { id: "ex19-q1", question: "How do you calculate MongoDB `skip` offset for page `P` with limit `L`?", options: ["(P - 1) * L", "P * L", "P + L", "L / P"], correct: 0, explanation: "Skip offset formula is `(page - 1) * limit`." },
      { id: "ex19-q2", question: "Why is capping maximum `limit` (e.g. `Math.min(100, limit)`) critical in production APIs?", options: ["To prevent malicious users from requesting 1,000,000 records in one request, causing server memory exhaustion", "To speed up CSS", "To disable database indexes", "To delete old records"], correct: 0, explanation: "Capping limit protects against Denial of Service (DoS) memory exhaustion." },
      { id: "ex19-q3", question: "What is a major downside of Offset-based pagination (`skip(100000)`) on massive datasets?", options: ["MongoDB must scan and discard 100,000 records, making queries slow", "It only works on Windows", "It cannot sort by date", "It deletes data"], correct: 0, explanation: "High offset skips degrade database performance linearly." },
      { id: "ex19-q4", question: "What is Cursor-based pagination?", options: ["Paginating using a unique indexed pointer (like `_id > lastSeenId`) instead of offset count", "Using a computer mouse cursor", "Paginating in HTML", "Sorting alphabetically"], correct: 0, explanation: "Cursor pagination queries records relative to a stable indexed cursor." },
      { id: "ex19-q5", question: "What metadata should a paginated API response include?", options: ["page, limit, totalItems, totalPages, hasNextPage", "User passwords", "Server IP address", "Database password"], correct: 0, explanation: "Pagination envelopes inform clients of page state and total counts." }
    ]
  ),
  makeLesson(
    "express-rest-api", 3, "Production APIs", "production-apis", 2,
    "api-security-rate-limiting", "API Security Hardening & Rate Limiting",
    "Protect Express APIs against brute-force attacks, DDoS, and CORS misconfigurations using rate limiters and Helmet.",
    "Express", "intermediate", 40, 160,
    ["express-rate-limit", "Helmet HTTP Security Headers", "CORS Origin Whitelisting", "Body Size Limits"],
    "Security Hardening",
    `import rateLimit from 'express-rate-limit';\nimport helmet from 'helmet';\n\napp.use(helmet());\nconst limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });\napp.use('/api/', limiter);`,
    [
      { id: "ex20-q1", question: "What HTTP status code does `express-rate-limit` return when a client exceeds allowed request quotas?", options: ["429 Too Many Requests", "400 Bad Request", "500 Internal Error", "403 Forbidden"], correct: 0, explanation: "429 Too Many Requests is the standard rate limit status code." },
      { id: "ex20-q2", question: "What does the `helmet()` middleware package do for Express apps?", options: ["Sets secure HTTP headers (X-Frame-Options, X-Content-Type-Options, CSP, etc.) to harden app defaults", "Encrypts MongoDB databases", "Validates emails", "Formats code"], correct: 0, explanation: "Helmet sets well-known HTTP security headers." },
      { id: "ex20-q3", question: "What does CORS stand for in web security?", options: ["Cross-Origin Resource Sharing", "Central Operation Request Standard", "Client Online Routing Service", "Cookie Origin Restriction Socket"], correct: 0, explanation: "CORS controls cross-origin request permissions." },
      { id: "ex20-q4", question: "Why is limiting JSON payload size (`express.json({ limit: '10kb' })`) recommended?", options: ["To prevent attackers from uploading massive JSON payloads that crash the server memory parser", "To speed up V8", "To format HTML", "To hide logs"], correct: 0, explanation: "Restricting payload size guards against body parser DoS attacks." },
      { id: "ex20-q5", question: "Which header is returned with 429 status codes telling clients when they can retry?", options: ["Retry-After", "Cache-Control", "Authorization", "Content-Type"], correct: 0, explanation: "The `Retry-After` header indicates wait time in seconds." }
    ]
  ),
  makeLesson(
    "express-rest-api", 3, "Production APIs", "production-apis", 3,
    "logging-observability", "Logging, Metrics & API Observability",
    "Integrate structured JSON logging (Winston/Pino), HTTP request loggers (Morgan), and correlation request IDs.",
    "Express", "intermediate", 40, 160,
    ["Structured JSON Logging (Pino/Winston)", "HTTP Logging with Morgan", "X-Request-ID Correlation Identifiers", "Log Levels (info, warn, error)"],
    "Logging & Observability",
    `import pino from 'pino';\nexport const logger = pino({ level: process.env.LOG_LEVEL || 'info' });\nlogger.info({ userId: 'usr_100' }, 'User logged in successfully');`,
    [
      { id: "ex21-q1", question: "Why is Structured JSON Logging preferred over `console.log` in production backend systems?", options: ["JSON logs are easily parsed, indexed, and queried by log management systems (Datadog, ELK, CloudWatch)", "JSON logs execute faster", "console.log causes crashes", "JSON logs format HTML"], correct: 0, explanation: "Structured JSON logs allow automated log aggregator indexing." },
      { id: "ex21-q2", question: "What is an `X-Request-ID` correlation identifier?", options: ["A unique ID generated per request that traces logs across microservices and async calls", "A database password", "A user cookie", "An encryption key"], correct: 0, explanation: "Correlation IDs connect all log messages belonging to a single request flow." },
      { id: "ex21-q3", question: "What log level should be used for expected system events like user registrations?", options: ["info", "error", "fatal", "debug"], correct: 0, explanation: "`info` is standard for routine operational events." },
      { id: "ex21-q4", question: "Why should sensitive data (passwords, credit card numbers, JWT tokens) be redacted before logging?", options: ["To prevent credential leakage in log management storage systems", "To save disk space", "To speed up V8", "To pass compiler"], correct: 0, explanation: "Log redaction prevents leaking secrets into log stores." },
      { id: "ex21-q5", question: "Which popular middleware logs incoming HTTP request details (method, path, status, response time) in Express?", options: ["morgan", "helmet", "cors", "dotenv"], correct: 0, explanation: "Morgan is the standard HTTP request logger middleware." }
    ]
  ),

  // Module 4: API Engineering
  makeLesson(
    "express-rest-api", 4, "API Engineering", "api-engineering", 1,
    "service-layer-architecture", "Service Layer Architecture & Business Logic Isolation",
    "Decouple controllers from business rules using Service classes, Dependency Injection, and Domain models.",
    "Express", "advanced", 40, 160,
    ["Controller vs Service separation", "Domain Services", "Unit Testing Services without HTTP mocks", "Transaction Management in Services"],
    "Service Layer Architecture",
    `export class UserService {\n  async register(data: RegisterDTO) {\n    // Business validation -> DB create -> Send email event\n  }\n}`,
    [
      { id: "ex22-q1", question: "What is the main responsibility of a Controller in Layered Architecture?", options: ["Extracting HTTP inputs, delegating to Service, and returning HTTP responses", "Executing raw database queries", "Hashing passwords", "Configuring CORS"], correct: 0, explanation: "Controllers handle HTTP protocol concerns and delegate business work to services." },
      { id: "ex22-q2", question: "What is the main responsibility of a Service class?", options: ["Encapsulating business rules, validations, and domain logic", "Formatting HTML CSS", "Parsing query strings", "Mounting express routes"], correct: 0, explanation: "Service classes implement core domain business logic." },
      { id: "ex22-q3", question: "Why does decoupling business logic from Express `req/res` objects improve testability?", options: ["Services can be unit-tested cleanly by passing plain JS objects without mocking Express req/res", "It makes tests compile faster", "It eliminates database usage", "It formats logs"], correct: 0, explanation: "Decoupled services don't depend on Express HTTP mocks during unit testing." },
      { id: "ex22-q4", question: "Where should transactional boundary logic (e.g. MongoDB sessions) be managed?", options: ["Inside the Service layer orchestrating multiple model operations", "In the view template", "In route paths", "In package.json"], correct: 0, explanation: "Services coordinate multi-document database transaction boundaries." },
      { id: "ex22-q5", question: "What pattern passes repository instances into service constructors?", options: ["Dependency Injection", "Singleton Pattern", "Observer Pattern", "Factory Pattern"], correct: 0, explanation: "Dependency Injection passes repository implementations into services." }
    ]
  ),
  makeLesson(
    "express-rest-api", 4, "API Engineering", "api-engineering", 2,
    "api-versioning-docs", "API Versioning & Swagger / OpenAPI Documentation",
    "Implement URL path versioning (`/api/v1/`), header versioning, and auto-generate Swagger/OpenAPI documentation.",
    "Express", "advanced", 40, 160,
    ["URL Path Versioning vs Header Versioning", "OpenAPI 3.0 Specifications", "swagger-ui-express Integration", "Deprecation Headers"],
    "API Versioning & Docs",
    `import swaggerUi from 'swagger-ui-express';\nimport swaggerDocument from './swagger.json';\n\napp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`,
    [
      { id: "ex23-q1", question: "What is the most widely adopted API versioning strategy?", options: ["URL Path Versioning (e.g. `/api/v1/users`)", "Query parameter `?v=1`", "Cookie versioning", "Hostname versioning"], correct: 0, explanation: "URL path versioning is clear, cache-friendly, and explicit." },
      { id: "ex23-q2", question: "What standard specification format is used to document RESTful APIs in JSON/YAML?", options: ["OpenAPI Specification (Swagger)", "HTML5 spec", "WSDL", "GraphQL schema"], correct: 0, explanation: "OpenAPI (formerly Swagger) is the standard REST documentation format." },
      { id: "ex23-q3", question: "What package serves interactive Swagger documentation UI in Express?", options: ["swagger-ui-express", "express-docs", "morgan", "helmet"], correct: 0, explanation: "`swagger-ui-express` mounts interactive API documentation endpoints." },
      { id: "ex23-q4", question: "What HTTP header signals to clients that an API endpoint is deprecated?", options: ["Deprecation: true", "Warning: 299 - Deprecated", "Sunset: <date>", "All of the above"], correct: 3, explanation: "Standard deprecation and sunset headers inform clients of endpoint lifecycle." },
      { id: "ex23-q5", question: "Why is breaking backward compatibility in an unversioned production API dangerous?", options: ["Existing mobile and client applications will crash when parsing modified payload fields", "It slows down database", "It deletes logs", "It changes server port"], correct: 0, explanation: "Breaking changes in unversioned endpoints cause client application crashes." }
    ]
  ),
  makeLesson(
    "express-rest-api", 4, "API Engineering", "api-engineering", 3,
    "production-api-structure", "Production API Project Structure & Deployment",
    "Organize enterprise production repositories with src/, dist/, tests/, config/, scripts/, and CI/CD docker builds.",
    "Express", "advanced", 40, 160,
    ["Enterprise Directory Structure", "Environment Configuration", "Dockerization & Multi-stage builds", "Production Deployment Checklist"],
    "Production API Project Structure",
    `// Enterprise Project Directory Layout\n// src/\n//   ├── config/\n//   ├── controllers/\n//   ├── services/\n//   ├── repositories/\n//   ├── middlewares/\n//   ├── models/\n//   └── server.ts`,
    [
      { id: "ex24-q1", question: "Where should business logic source code reside in an enterprise Node.js repository?", options: ["Inside the `src/` directory", "In node_modules/", "In public/", "In root directory directly"], correct: 0, explanation: "`src/` isolates all application source files." },
      { id: "ex24-q2", question: "What is the purpose of Docker multi-stage builds in production deployment?", options: ["To separate build tools (TypeScript compiler) from final lightweight production runtime images", "To install multiple operating systems", "To run tests in loop", "To format JSON"], correct: 0, explanation: "Multi-stage builds produce tiny, secure production container images." },
      { id: "ex24-q3", question: "What command starts a production Node app using compiled code?", options: ["node dist/server.js", "npm run dev", "tsc --watch", "nodemon"], correct: 0, explanation: "Production backends run compiled JS files using `node` directly." },
      { id: "ex24-q4", question: "Why should `NODE_ENV` be set to `'production'` on production servers?", options: ["It enables framework performance optimizations, disables verbose debug logs, and enforces security modes", "It changes compiler colors", "It installs devDependencies", "It formats code"], correct: 0, explanation: "`NODE_ENV=production` triggers production optimizations in Express and Node." },
      { id: "ex24-q5", question: "What process manager can manage Node.js cluster processes and automatic restarts in production VMs?", options: ["PM2", "NPM", "VS Code", "Git"], correct: 0, explanation: "PM2 manages Node process clustering and daemon restarts." }
    ]
  ),

  // =========================================================================
  // COURSE 4: MongoDB & Database Engineering (12 Lessons)
  // =========================================================================
  makeLesson(
    "mongodb-database", 1, "MongoDB Fundamentals", "mongodb-foundations", 1,
    "mongodb-documents-collections", "MongoDB Documents, Collections & BSON Architecture",
    "Deep dive into NoSQL document databases, BSON data types, dynamic schema flexibility, and collections.",
    "Database", "intermediate", 35, 150,
    ["JSON vs BSON Data Types", "Collections & BSON Documents", "12-Byte ObjectId Structure", "Database Commands & mongosh"],
    "BSON & Document Architecture",
    `// BSON Document Example\n{\n  "_id": ObjectId("650000000000000000000100"),\n  "title": "MongoDB Engineering",\n  "tags": ["database", "nosql"],\n  "createdAt": ISODate("2026-08-30T12:00:00Z")\n}`,
    [
      { id: "mg25-q1", question: "What binary document format does MongoDB use internally for storage and network transfer?", options: ["BSON (Binary JSON)", "XML", "Protobuf", "YAML"], correct: 0, explanation: "BSON provides binary representation of JSON with extended data types." },
      { id: "mg25-q2", question: "What extended data types does BSON support that standard JSON lacks?", options: ["ObjectId, Date, BinData, Regex, Decimal128", "Boolean, String, Number", "HTML, CSS", "PNG, JPEG"], correct: 0, explanation: "BSON supports Date, ObjectId, Decimal128, and binary data." },
      { id: "mg25-q3", question: "What is a MongoDB Collection?", options: ["A grouping of MongoDB BSON documents, analogous to a relational table", "A single row", "A database index file", "A backup folder"], correct: 0, explanation: "Collections store related BSON documents." },
      { id: "mg25-q4", question: "What components comprise a 12-byte MongoDB ObjectId?", options: ["4-byte timestamp + 5-byte random value + 3-byte incrementing counter", "12 random letters", "IP address + MAC address", "File path hash"], correct: 0, explanation: "ObjectIds combine timestamp, process random bytes, and counter." },
      { id: "mg25-q5", question: "What command line shell is used to interact directly with MongoDB databases?", options: ["mongosh", "node-shell", "sqlsh", "bash-mongo"], correct: 0, explanation: "`mongosh` is the official MongoDB interactive shell." }
    ]
  ),
  makeLesson(
    "mongodb-database", 1, "MongoDB Fundamentals", "mongodb-foundations", 2,
    "mongodb-crud-operations", "MongoDB CRUD Operations & Command Syntax",
    "Master `insertOne`, `insertMany`, `find`, `updateOne`, `updateMany`, `replaceOne`, and `deleteOne` operations.",
    "Database", "intermediate", 35, 150,
    ["insertMany & insertOne", "find & findOne Projection", "updateOne & updateMany ($set, $inc, $push)", "deleteOne & deleteMany"],
    "CRUD Operations",
    `db.users.updateOne(\n  { email: "jane@example.com" },\n  { $inc: { totalXP: 100 }, $set: { lastActive: new Date() } }\n);`,
    [
      { id: "mg26-q1", question: "Which update operator increments a numeric field value by a specified number?", options: ["$inc", "$set", "$push", "$add"], correct: 0, explanation: "`$inc` increments numeric field values atomically." },
      { id: "mg26-q2", question: "Which update operator sets or modifies a field value in a document?", options: ["$set", "$inc", "$put", "$update"], correct: 0, explanation: "`$set` replaces field values." },
      { id: "mg26-q3", question: "Which update operator appends an element to an array field?", options: ["$push", "$addToSet", "$append", "$insert"], correct: 0, explanation: "`$push` appends elements to arrays." },
      { id: "mg26-q4", question: "What is 'Projection' in MongoDB `find({}, { name: 1, email: 1 })` queries?", options: ["Specifying which fields to include or exclude in query results to reduce bandwidth", "Projecting onto screen", "Creating indexes", "Deleting records"], correct: 0, explanation: "Projections limit returned fields." },
      { id: "mg26-q5", question: "What does `{ upsert: true }` do in an update operation?", options: ["Inserts a new document if no document matches the query filter", "Deletes existing documents", "Throws an error if found", "Backs up data"], correct: 0, explanation: "`upsert: true` creates a record if no match exists." }
    ]
  ),
  makeLesson(
    "mongodb-database", 1, "MongoDB Fundamentals", "mongodb-foundations", 3,
    "mongodb-query-operators", "MongoDB Query & Comparison Operators",
    "Use comparison ($gt, $gte, $lt, $in, $ne) and logical ($and, $or, $nor, $not) operators for complex queries.",
    "Database", "intermediate", 35, 150,
    ["Comparison Operators ($eq, $gt, $in)", "Logical Operators ($or, $and)", "Element Operators ($exists, $type)", "Array Operators ($elemMatch)"],
    "Query Operators",
    `db.lessons.find({\n  xpReward: { $gte: 150 },\n  tags: { $in: ["node", "express"] },\n  published: { $exists: true, $eq: true }\n});`,
    [
      { id: "mg27-q1", question: "Which operator matches values greater than or equal to a specified value?", options: ["$gte", "$gt", "$eq", "$in"], correct: 0, explanation: "`$gte` stands for Greater Than or Equal." },
      { id: "mg27-q2", question: "Which operator matches documents where a field value equals any value in a specified array?", options: ["$in", "$or", "$elemMatch", "$all"], correct: 0, explanation: "`$in` matches any value in an array list." },
      { id: "mg27-q3", question: "Which query operator checks whether a field exists in a document?", options: ["$exists", "$type", "$has", "$is"], correct: 0, explanation: "`$exists: true` checks field presence." },
      { id: "mg27-q4", question: "Which array query operator matches documents containing an array field with at least one element matching all specified criteria?", options: ["$elemMatch", "$all", "$in", "$slice"], correct: 0, explanation: "`$elemMatch` evaluates multiple criteria against single array elements." },
      { id: "mg27-q5", question: "Which logical operator joins query clauses with a logical OR?", options: ["$or", "$and", "$nor", "$not"], correct: 0, explanation: "`$or` returns documents matching at least one clause." }
    ]
  ),

  // Module 2: Data Modeling
  makeLesson(
    "mongodb-database", 2, "Data Modeling", "data-modeling", 1,
    "embedding-vs-referencing", "Embedding vs Referencing Data Modeling Strategies",
    "Choose between Embedded Documents (1:1, 1:Few) and Document References (1:Many, Many:Many) based on query patterns.",
    "Database", "intermediate", 35, 150,
    ["Embedding (Denormalization)", "Referencing (Normalization via ObjectIds)", "16MB Document Size Limit Rule", "Query Patterns Driving Schema"],
    "Data Modeling Strategies",
    `// Embedded Sub-document (1:Few)\n{\n  "_id": ObjectId("..."),\n  "title": "HTTP Basics",\n  "quiz": { "questions": [...] }\n}\n\n// Referenced Document (1:Many)\n{\n  "_id": ObjectId("..."),\n  "courseId": ObjectId("...")\n}`,
    [
      { id: "mg28-q1", question: "What is the maximum hard size limit for a single BSON document in MongoDB?", options: ["16 Megabytes (16MB)", "4 Gigabytes", "1 Megabyte", "100 Kilobytes"], correct: 0, explanation: "MongoDB enforces a 16MB document size limit." },
      { id: "mg28-q2", question: "When is Embedding data (denormalization) ideal?", options: ["When data is bound together and read together in 1:1 or 1:Few relationships", "When sub-documents grow infinitely without bound", "When data is updated by millions of concurrent threads", "Always"], correct: 0, explanation: "Embedding is best for 1:Few relationships read together." },
      { id: "mg28-q3", question: "When is Referencing data (normalization) necessary?", options: ["When modeling 1:Many or Many:Many relationships where embedded arrays would exceed 16MB or grow unbounded", "When storing small strings", "Only for passwords", "Never"], correct: 0, explanation: "Referencing prevents unbounded array growth and 16MB document limit violations." },
      { id: "mg28-q4", question: "What is the primary trade-off of Embedding data?", options: ["Faster read performance (no joins required) but potential data duplication and document size growth", "Slower queries", "Higher RAM usage", "No primary key"], correct: 0, explanation: "Embedding eliminates joins for fast reads, but risks larger document sizes." },
      { id: "mg28-q5", question: "What rule should guide NoSQL schema design above all else?", options: ["Design schemas based on application query patterns and read/write ratios", "Always normalize to 3rd Normal Form", "Never use arrays", "Use random field names"], correct: 0, explanation: "Query access patterns drive NoSQL data modeling decisions." }
    ]
  ),
  makeLesson(
    "mongodb-database", 2, "Data Modeling", "data-modeling", 2,
    "schema-design-patterns", "Schema Design Patterns & Anti-Patterns",
    "Apply production schema patterns: Attribute Pattern, Bucket Pattern, Subset Pattern, and Polymorphic Pattern.",
    "Database", "intermediate", 35, 150,
    ["Subset Pattern (Caching Top Items)", "Bucket Pattern (Time-Series Data)", "Attribute Pattern", "Unbounded Array Anti-Pattern"],
    "Schema Design Patterns",
    `// Subset Pattern: Store top 5 recent reviews directly in Product for instant display\n{\n  "_id": ObjectId("..."),\n  "name": "Laptop",\n  "recentReviews": [{ "user": "Jane", "rating": 5 }]\n}`,
    [
      { id: "mg29-q1", question: "What is the 'Unbounded Array' anti-pattern in MongoDB?", options: ["Allowing an embedded array to grow indefinitely without limit, leading to 16MB document errors and memory degradation", "Sorting arrays", "Using 2 elements in array", "Deleting arrays"], correct: 0, explanation: "Unbounded arrays degrade write performance and violate size limits." },
      { id: "mg29-q2", question: "What is the Subset Pattern?", options: ["Embedding a subset of most frequently accessed related items (e.g. top 5 recent reviews) in the main document to reduce joins", "Splitting databases", "Deleting old rows", "Using SQL joins"], correct: 0, explanation: "The Subset Pattern caches frequently read data in the main document." },
      { id: "mg30-q3", question: "What is the Bucket Pattern used for?", options: ["Grouping time-series data (like log metrics per hour) into aggregate bucket documents to optimize index size", "Uploading images to S3", "Cleaning logs", "Encrypting passwords"], correct: 0, explanation: "Bucket patterns condense time-series data into manageable documents." },
      { id: "mg29-q4", question: "What is the Attribute Pattern?", options: ["Structuring sparse or polymorphic key-value pairs into `[{ k: 'color', v: 'blue' }]` for easy indexing", "Adding CSS attributes", "Writing HTML tags", "Using string IDs"], correct: 0, explanation: "Attribute Pattern enables indexing across variable product traits." },
      { id: "mg29-q5", question: "What is the Computed Pattern?", options: ["Pre-computing and storing calculated values (like totalXP or averageRating) during writes to eliminate heavy runtime aggregation reads", "Calculating math in CSS", "Running client JS", "Deleting indexes"], correct: 0, explanation: "Pre-computing aggregates speeds up read queries." }
    ]
  ),
  makeLesson(
    "mongodb-database", 2, "Data Modeling", "data-modeling", 3,
    "database-validation-rules", "MongoDB Schema Validation Rules",
    "Enforce database-level document validation rules using JSON Schema `$jsonSchema` constraints.",
    "Database", "intermediate", 35, 150,
    ["Database-Level Schema Validation", "$jsonSchema Operator", "validationLevel & validationAction", "Data Integrity Protection"],
    "MongoDB Schema Validation",
    `db.createCollection("users", {\n  validator: {\n    $jsonSchema: {\n      bsonType: "object",\n      required: ["email", "name"],\n      properties: { email: { bsonType: "string" } }\n    }\n  }\n});`,
    [
      { id: "mg30-q1", question: "Where does MongoDB `$jsonSchema` validation execute?", options: ["Inside the MongoDB database server engine upon document insert/update", "Inside browser JS", "In CSS", "In client terminal"], correct: 0, explanation: "`$jsonSchema` rules are enforced directly by the database engine." },
      { id: "mg30-q2", question: "What `validationAction` setting instructs MongoDB to reject invalid documents and return an error?", options: ["\"error\"", "\"warn\"", "\"ignore\"", "\"log\""], correct: 0, explanation: "`validationAction: \"error\"` aborts writes that violate validation rules." },
      { id: "mg30-q3", question: "What property specifies mandatory fields in `$jsonSchema`?", options: ["required", "mandatory", "fields", "must"], correct: 0, explanation: "The `required` array lists mandatory document properties." },
      { id: "mg30-q4", question: "Why is database-level schema validation useful alongside application ODM validation (Mongoose/Zod)?", options: ["It provides defense-in-depth data integrity even if direct database scripts or raw drivers bypass application code", "It speeds up network speed", "It formats HTML", "It replaces indexes"], correct: 0, explanation: "Database validators guarantee schema integrity regardless of application access path." },
      { id: "mg30-q5", question: "Which BSON type in `$jsonSchema` validates a string field?", options: ["\"string\"", "\"varchar\"", "\"text\"", "\"char\""], correct: 0, explanation: "`bsonType: \"string\"` validates text values." }
    ]
  ),

  // Module 3: Performance
  makeLesson(
    "mongodb-database", 3, "Performance", "database-performance", 1,
    "indexes-query-performance", "Indexes & Query Performance Optimization",
    "Understand B-Tree indexes, Single Field, Compound, Unique, Text, and TTL indexes, and analyze `explain('executionStats')`.",
    "Database", "intermediate", 40, 160,
    ["Index Internal Structure (B-Tree)", "Single Field & Compound Indexes", "ESR Rule (Equality, Sort, Range)", "explain('executionStats') Analysis"],
    "Indexing & Explain Plans",
    `db.users.createIndex({ category: 1, order: 1 });\ndb.users.find({ category: "Backend" }).sort({ order: 1 }).explain("executionStats");`,
    [
      { id: "mg31-q1", question: "What data structure does MongoDB use for indexes?", options: ["B-Tree", "Linked List", "Hash Table only", "Binary Search Tree"], correct: 0, explanation: "MongoDB builds B-Tree indexes for fast range and equality searches." },
      { id: "mg31-q2", question: "What is the ESR Rule for optimal Compound Index ordering?", options: ["Equality fields first, Sort fields second, Range fields last", "Element, String, Record", "Error, Status, Response", "Equals, Same, Right"], correct: 0, explanation: "ESR (Equality, Sort, Range) optimizes index scan selectivity." },
      { id: "mg31-q3", question: "What stage in `explain('executionStats')` indicates a slow query examining every document without an index?", options: ["COLLSCAN (Collection Scan)", "IXSCAN (Index Scan)", "FETCH", "SORT"], correct: 0, explanation: "COLLSCAN indicates a full collection scan lacking an applicable index." },
      { id: "mg31-q4", question: "What stage in `explain('executionStats')` indicates a fast query utilizing an index?", options: ["IXSCAN (Index Scan)", "COLLSCAN", "REJECT", "FAIL"], correct: 0, explanation: "IXSCAN signifies query resolution via an index scan." },
      { id: "mg31-q5", question: "What is a Covered Query?", options: ["A query where all requested fields are satisfied directly from the Index without reading documents from disk", "A query with SSL", "A query with 10 filters", "A encrypted collection"], correct: 0, explanation: "Covered queries read data entirely from index pages, skipping document fetch." }
    ]
  ),
  makeLesson(
    "mongodb-database", 3, "Performance", "database-performance", 2,
    "aggregation-pipeline-mastery", "MongoDB Aggregation Pipeline Mastery",
    "Build multi-stage data pipelines using `$match`, `$project`, `$group`, `$unwind`, `$lookup`, and `$facet`.",
    "Database", "intermediate", 40, 160,
    ["Aggregation Pipeline Stages", "$match and $group ($sum, $avg)", "$lookup (Left Outer Join)", "$unwind and $facet"],
    "Aggregation Pipeline",
    `db.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$userId", totalSpent: { $sum: "$amount" } } },\n  { $sort: { totalSpent: -1 } }\n]);`,
    [
      { id: "mg32-q1", question: "What stage in the Aggregation Pipeline filters documents matching specified criteria?", options: ["$match", "$filter", "$find", "$where"], correct: 0, explanation: "`$match` filters documents early in the pipeline." },
      { id: "mg32-q2", question: "What stage performs document grouping and calculates aggregated sums, averages, or totals?", options: ["$group", "$collect", "$sum", "$aggregate"], correct: 0, explanation: "`$group` groups documents by specified key expression." },
      { id: "mg32-q3", question: "Which aggregation stage performs a Left Outer Join between two collections?", options: ["$lookup", "$join", "$merge", "$connect"], correct: 0, explanation: "`$lookup` performs relational joins between collections." },
      { id: "mg32-q4", question: "What does the `$unwind` aggregation stage do to an array field?", options: ["Deconstructs an array field from input documents to output a document for EACH element", "Deletes array", "Sorts array", "Encodes array"], correct: 0, explanation: "`$unwind` flattens array elements into individual documents." },
      { id: "mg32-q5", question: "Why should `$match` stages be placed at the VERY BEGINNING of an aggregation pipeline?", options: ["To utilize indexes and reduce the number of documents passed to subsequent pipeline stages", "Because MongoDB requires it", "To format JSON", "To create collections"], correct: 0, explanation: "Early `$match` stages leverage indexes and shrink dataset volume." }
    ]
  ),
  makeLesson(
    "mongodb-database", 3, "Performance", "database-performance", 3,
    "large-dataset-design", "Pagination & Large Dataset Performance Design",
    "Optimize queries on millions of documents using Cursor-Based Pagination, Bucketing, and Read Preference Routing.",
    "Database", "intermediate", 40, 160,
    ["High-Offset Performance Degradation", "Keyset / Cursor Pagination", "Replica Set Read Preferences", "Connection Pool Tuning"],
    "Large Dataset Performance",
    `db.logs.find({ _id: { $gt: lastSeenId } }).sort({ _id: 1 }).limit(20);`,
    [
      { id: "mg33-q1", question: "Why does `.skip(500000)` cause severe latency on large MongoDB collections?", options: ["MongoDB must traverse 500,000 index entries to discard them before returning results", "It crashes the CPU", "It requires HTTPS", "It deletes data"], correct: 0, explanation: "High skip offsets require processing and discarding discarded records." },
      { id: "mg33-q2", question: "How does Key-based (Cursor) pagination solve high-offset query slowdowns?", options: ["By using indexed inequality queries (`_id > lastSeenId`) that jump directly to the target record in O(log N) time", "By deleting old records", "By using lower limit", "By using SQL joins"], correct: 0, explanation: "Cursor pagination leverages index bounds to jump directly to the next page." },
      { id: "mg33-q3", question: "What is a Replica Set Read Preference?", options: ["Configuring driver read queries to route to Secondary nodes to offload read traffic from Primary node", "Setting font size", "Sorting by date", "Disabling writes"], correct: 0, explanation: "Secondary read preferences distribute read query throughput across replica nodes." },
      { id: "mg33-q4", question: "What parameter controls maximum concurrent database connections opened by Node.js driver?", options: ["maxPoolSize", "poolCount", "connections", "dbLimit"], correct: 0, explanation: "`maxPoolSize` manages maximum socket connections in the connection pool." },
      { id: "mg33-q5", question: "What happens if all connection sockets in the MongoDB connection pool are busy when a new query arrives?", options: ["The query waits in an internal queue until a connection becomes available or `waitQueueTimeoutMS` expires", "The server reboots", "Query returns 200 OK", "Database is deleted"], correct: 0, explanation: "Queries queue until pool connections free up or queue timeout is reached." }
    ]
  ),

  // Module 4: Mongoose Advanced
  makeLesson(
    "mongodb-database", 4, "Mongoose Advanced", "mongoose-advanced", 1,
    "mongoose-schemas-models", "Mongoose Schemas, Models & Virtuals",
    "Define Mongoose Schemas, Instance Methods, Static Methods, Virtual Properties, and Getters/Setters.",
    "Database", "advanced", 40, 160,
    ["Mongoose Schema & Types", "Virtual Properties with getters", "Static vs Instance Methods", "Pre & Post Middleware Hooks"],
    "Mongoose Schemas & Virtuals",
    `const userSchema = new Schema({ firstName: String, lastName: String });\nuserSchema.virtual('fullName').get(function() {\n  return \`\${this.firstName} \${this.lastName}\`;\n});`,
    [
      { id: "mg34-q1", question: "What is a Mongoose Virtual property?", options: ["A document property that is computed on the fly and NOT persisted to MongoDB disk storage", "A database table", "An encrypted key", "A CSS class"], correct: 0, explanation: "Virtuals are computed properties that do not persist to MongoDB." },
      { id: "mg34-q2", question: "What option must be set on Schema to include Virtuals when converting documents to JSON (`res.json(doc)`)?", options: ["{ virtuals: true } in toJSON options", "{ includeVirtuals: true }", "{ saveVirtuals: true }", "{ showAll: true }"], correct: 0, explanation: "`toJSON: { virtuals: true }` includes virtual properties in JSON outputs." },
      { id: "mg34-q3", question: "What is the difference between a Mongoose Static Method and an Instance Method?", options: ["Static methods are called on the Model (`User.findByEmail()`), Instance methods are called on a document instance (`user.comparePassword()`)", "Static methods use SQL", "Instance methods run on server boot", "There is no difference"], correct: 0, explanation: "Statics attach to Models; methods attach to Document instances." },
      { id: "mg34-q4", question: "What hook executes before a document `.save()` operation in Mongoose?", options: ["userSchema.pre('save', function(next) { ... })", "userSchema.post('save')", "userSchema.before('save')", "userSchema.on('save')"], correct: 0, explanation: "`pre('save')` hooks run before document persistence (e.g. for password hashing)." },
      { id: "mg34-q5", question: "Why is calling `Object.assign()` on Mongoose documents dangerous without `runValidators: true`?", options: ["Mongoose updates by default bypass schema validators unless `{ runValidators: true }` option is explicitly set", "It crashes Node", "It deletes collection", "It changes database name"], correct: 0, explanation: "Update operations require `runValidators: true` to enforce schema constraints." }
    ]
  ),
  makeLesson(
    "mongodb-database", 4, "Mongoose Advanced", "mongoose-advanced", 2,
    "relationships-populate", "Mongoose Relationships & Population Architecture",
    "Model document references (`ref: 'Model'`) and populate referenced documents using `.populate()`, deep populates, and field selection.",
    "Database", "advanced", 40, 160,
    ["Schema.Types.ObjectId references (`ref`)", ".populate('author', 'name email')", "Deep Nested Populate", "Performance Overhead of Populate"],
    "Mongoose Relationships",
    `const postSchema = new Schema({ title: String, author: { type: Schema.Types.ObjectId, ref: 'User' } });\nconst post = await Post.findById(id).populate('author', 'name email');`,
    [
      { id: "mg35-q1", question: "What Mongoose query method replaces referenced ObjectIds in a document with the actual documents from another collection?", options: [".populate()", ".join()", ".include()", ".fetch()"], correct: 0, explanation: "`.populate()` automatically substitutes ObjectIds with referenced documents." },
      { id: "mg35-q2", question: "How do you specify referencing a `User` model on an ObjectId schema path?", options: ["{ type: Schema.Types.ObjectId, ref: 'User' }", "{ type: 'User' }", "{ link: 'User' }", "{ model: 'User' }"], correct: 0, explanation: "The `ref` option names the target Mongoose model for population." },
      { id: "mg35-q3", question: "How do you select ONLY the `name` and `email` fields when populating an `author` ref?", options: ["populate('author', 'name email')", "populate('author', ['name', 'email'])", "populate({ path: 'author', select: 'name email' })", "Both 1 and 3"], correct: 3, explanation: "Field selection string or select option isolates populated fields." },
      { id: "mg35-q4", question: "How does Mongoose execute `.populate()` under the hood?", options: ["It executes separate secondary `find({ _id: { $in: ids } })` queries behind the scenes", "It uses SQL joins natively", "It runs client JS loops", "It modifies database indexes"], correct: 0, explanation: "Populate executes follow-up queries behind the scenes." },
      { id: "mg35-q5", question: "What is the N+1 query problem when populating arrays in large loops?", options: ["Executing N additional database queries for N items, causing severe query latency", "Having 1 extra row", "Adding 1 to numbers", "Deleting records"], correct: 0, explanation: "N+1 query issues occur when executing database calls inside loops instead of batching." }
    ]
  ),
  makeLesson(
    "mongodb-database", 4, "Mongoose Advanced", "mongoose-advanced", 3,
    "transactions-production", "ACID Transactions & Production Operations",
    "Implement multi-document ACID transactions with Mongoose sessions (`startSession()`, `withTransaction()`), and connection retry policies.",
    "Database", "advanced", 40, 160,
    ["ACID Transactions in MongoDB", "Session Management (`db.startSession()`)", "withTransaction Helper", "Handling Transient Transaction Errors"],
    "MongoDB ACID Transactions",
    `const session = await mongoose.startSession();\nsession.startTransaction();\ntry {\n  await User.updateOne({ _id: senderId }, { $inc: { balance: -100 } }, { session });\n  await User.updateOne({ _id: receiverId }, { $inc: { balance: 100 } }, { session });\n  await session.commitTransaction();\n} catch (err) {\n  await session.abortTransaction();\n} finally {\n  session.endSession();\n}`,
    [
      { id: "mg36-q1", question: "What requirement must MongoDB deployment satisfy to support multi-document ACID Transactions?", options: ["Must be running as a Replica Set or Sharded Cluster", "Must run on Windows", "Must use single node without logs", "Must be less than 1MB"], correct: 0, explanation: "MongoDB transactions require a Replica Set or Sharded Cluster deployment." },
      { id: "mg36-q2", question: "What method starts a new transaction session in Mongoose?", options: ["mongoose.startSession()", "mongoose.beginTx()", "mongoose.createTransaction()", "mongoose.session()"], correct: 0, explanation: "`startSession()` initiates a transaction session handle." },
      { id: "mg36-q3", question: "What method permanently applies all operations executed within a transaction session to disk?", options: ["session.commitTransaction()", "session.save()", "session.apply()", "session.end()"], correct: 0, explanation: "`commitTransaction()` commits all buffered writes atomically." },
      { id: "mg36-q4", question: "What method cancels and rolls back all pending operations in a transaction session upon error?", options: ["session.abortTransaction()", "session.cancel()", "session.rollback()", "session.undo()"], correct: 0, explanation: "`abortTransaction()` rolls back transaction writes." },
      { id: "mg36-q5", question: "What helper function in Mongoose handles session start, commit, abort, and automatic retries for transient errors?", options: ["session.withTransaction(async () => { ... })", "session.auto()", "session.try()", "session.run()"], correct: 0, explanation: "`withTransaction()` automates transaction lifecycle and transient error retries." }
    ]
  ),

  // =========================================================================
  // COURSE 5: Backend Authentication & Security (12 Lessons)
  // =========================================================================
  makeLesson(
    "backend-auth-security", 1, "Authentication Fundamentals", "auth-fundamentals", 1,
    "auth-vs-authorization", "Authentication vs Authorization Architecture",
    "Understand the fundamental difference between Authentication ('Who are you?') and Authorization ('What are you allowed to do?').",
    "Security", "intermediate", 35, 150,
    ["Authentication (AuthN) Concepts", "Authorization (AuthZ) Principles", "Identity Verification", "Principle of Least Privilege"],
    "AuthN vs AuthZ",
    `// Authentication: Verify credentials & identity\nconst user = await verifyPassword(email, password);\n\n// Authorization: Check permission\nif (user.role !== 'admin') throw new ForbiddenError("Requires Admin Role");`,
    [
      { id: "sec37-q1", question: "What is Authentication (AuthN)?", options: ["The process of verifying the identity of a user or system ('Who are you?')", "Checking permissions to delete a file", "Formatting JSON responses", "Encrypting database backups"], correct: 0, explanation: "Authentication verifies identity using credentials." },
      { id: "sec37-q2", question: "What is Authorization (AuthZ)?", options: ["The process of determining what resources or actions an authenticated identity is permitted to access ('What can you do?')", "Verifying passwords", "Sending welcome emails", "Creating users"], correct: 0, explanation: "Authorization checks access permissions and roles." },
      { id: "sec37-q3", question: "Which HTTP status code signifies an Authentication failure (Unauthenticated)?", options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "500 Server Error"], correct: 0, explanation: "HTTP 401 indicates missing or invalid identity credentials." },
      { id: "sec37-q4", question: "Which HTTP status code signifies an Authorization failure (Forbidden)?", options: ["403 Forbidden", "401 Unauthorized", "400 Bad Request", "405 Method Not Allowed"], correct: 0, explanation: "HTTP 403 indicates an authenticated user lacks required permissions." },
      { id: "sec37-q5", question: "What is the Principle of Least Privilege in security architecture?", options: ["Granting users and services only the minimum permissions required to perform their task", "Giving all users admin access", "Deleting user roles", "Disabling passwords"], correct: 0, explanation: "Least privilege minimizes attack blast radius by restricting unnecessary access." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 1, "Authentication Fundamentals", "auth-fundamentals", 2,
    "password-hashing-bcrypt", "Password Hashing & Salting with bcrypt",
    "Hash and salt user passwords securely using bcrypt, preventing rainbow table attacks and plaintext leakage.",
    "Security", "intermediate", 35, 150,
    ["Why Plaintext & MD5/SHA1 are Compromised", "Cryptographic Salt Generation", "bcrypt Work Factor (Cost Factor)", "Timing Attack Safe Comparison"],
    "Password Hashing with bcrypt",
    `import bcrypt from 'bcrypt';\n\nconst SALT_ROUNDS = 12;\nexport const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);\nexport const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);`,
    [
      { id: "sec38-q1", question: "Why must passwords NEVER be stored as plaintext or simple MD5/SHA256 hashes?", options: ["Because simple hashes are vulnerable to instant cracking using pre-computed Rainbow Tables and GPU brute-force", "Because databases don't store text", "Because Node.js rejects text", "Because passwords expire"], correct: 0, explanation: "MD5/SHA256 are extremely fast, making GPU brute-force attacks trivial." },
      { id: "sec38-q2", question: "What is a Cryptographic Salt in password hashing?", options: ["A unique, random sequence of bytes added to each password before hashing to ensure identical passwords yield different hashes", "A database password", "A user cookie", "An HTML key"], correct: 0, explanation: "Salts defeat pre-computed rainbow table attacks." },
      { id: "sec38-q3", question: "What does the Work Factor (Salt Rounds) in bcrypt control?", options: ["The exponential computational cost/time required to compute the hash, slowing down brute-force attacks", "The max length of password", "The database timeout", "The server port"], correct: 0, explanation: "Bcrypt work factor forces slow computation to thwart GPU cracking." },
      { id: "sec38-q4", question: "Why should `bcrypt.compare()` be used instead of standard `===` string equality when checking passwords?", options: ["`bcrypt.compare` executes in constant time to prevent Timing Attacks", "It is shorter to write", "It converts string to number", "It resets password"], correct: 0, explanation: "Constant-time string comparison guards against side-channel timing attacks." },
      { id: "sec38-q5", question: "What is a recommended bcrypt salt rounds value for production systems in 2026?", options: ["10 to 12 rounds", "1 round", "100 rounds", "0 rounds"], correct: 0, explanation: "10–12 salt rounds balances security and server CPU response time." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 1, "Authentication Fundamentals", "auth-fundamentals", 3,
    "sessions-cookies-auth", "Stateful Sessions & HTTP-Only Cookie Security",
    "Implement stateful session management with `express-session`, Redis session stores, and secure HTTP-Only cookies.",
    "Security", "intermediate", 35, 150,
    ["Session Store Architecture", "HTTP-Only & Secure Cookie Flags", "SameSite CSRF Protection (Strict vs Lax)", "Session Hijacking Mitigation"],
    "Session & Cookie Security",
    `app.use(session({\n  name: 'sid',\n  secret: process.env.SESSION_SECRET!,\n  resave: false,\n  saveUninitialized: false,\n  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400000 }\n}));`,
    [
      { id: "sec39-q1", question: "What does the `httpOnly: true` cookie flag prevent?", options: ["Prevents client-side JavaScript (`document.cookie`) from accessing the cookie, mitigating XSS token theft", "Prevents HTTP requests", "Prevents database writes", "Prevents CSS loading"], correct: 0, explanation: "`httpOnly` prevents malicious XSS scripts from reading sensitive authentication cookies." },
      { id: "sec39-q2", question: "What does the `secure: true` cookie flag enforce?", options: ["Enforces that the cookie is transmitted ONLY over encrypted HTTPS connections", "Encrypts the database", "Hashes user names", "Locks server port"], correct: 0, explanation: "`secure: true` blocks sending cookies over unencrypted HTTP." },
      { id: "sec39-q3", question: "What attack does the `SameSite: 'lax'` or `'strict'` cookie attribute protect against?", options: ["Cross-Site Request Forgery (CSRF)", "SQL Injection", "Buffer Overflow", "DNS Spoofing"], correct: 0, explanation: "`SameSite` prevents browsers from sending cookies on cross-site requests (CSRF)." },
      { id: "sec39-q4", question: "Where should production session data be stored in scalable multi-server environments?", options: ["In a centralized fast key-value store like Redis", "In server local memory", "In HTML code", "In browser localStorage"], correct: 0, explanation: "Redis enables shared, stateful session state across load-balanced server instances." },
      { id: "sec39-q5", question: "What is Session Fixation?", options: ["An attack where a user is tricked into authenticating with a known session ID provided by an attacker", "Fixing a bug", "Upgrading Node", "Deleting cookies"], correct: 0, explanation: "Session fixation is prevented by regenerating session IDs upon login." }
    ]
  ),

  // Module 2: JWT Authentication
  makeLesson(
    "backend-auth-security", 2, "JWT Authentication", "jwt-authentication", 1,
    "jwt-structure-verification", "JWT Structure, Signing & Verification Architecture",
    "Deconstruct JSON Web Tokens (Header, Payload, Signature), HMAC SHA256 vs RS256 signing, and validation.",
    "Security", "intermediate", 35, 150,
    ["JWT 3-Part Structure (Header.Payload.Signature)", "HMAC SHA256 (Secret) vs RS256 (Asymmetric Keys)", "Token Expiration (`exp`)", "Stateless Token Verification"],
    "JWT Verification",
    `import jwt from 'jsonwebtoken';\n\nconst token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '15m' });\nconst decoded = jwt.verify(token, process.env.JWT_SECRET!);`,
    [
      { id: "sec40-q1", question: "What are the 3 dot-separated parts of a JSON Web Token (JWT)?", options: ["Header . Payload . Signature", "User . Pass . Hash", "Client . Server . Key", "Title . Body . Footer"], correct: 0, explanation: "JWTs consist of Base64Url-encoded Header, Payload, and Signature." },
      { id: "sec40-q2", question: "Is the Payload section of a standard JWT encrypted by default?", options: ["No, it is only Base64Url encoded and readable by anyone unless encrypted with JWE", "Yes, fully AES-256 encrypted", "It is hashed with bcrypt", "It is invisible"], correct: 0, explanation: "JWT payloads are encoded, not encrypted. Sensitive secrets must not be stored in JWT payloads." },
      { id: "sec40-q3", question: "What claim in a JWT payload specifies the expiration timestamp?", options: ["exp", "iat", "sub", "iss"], correct: 0, explanation: "`exp` represents the expiration Unix epoch timestamp." },
      { id: "sec40-q4", question: "What is the key difference between HMAC SHA256 (HS256) and RS256 JWT signing?", options: ["HS256 uses a shared symmetric secret key; RS256 uses an asymmetric private key for signing and public key for verification", "HS256 is slow", "RS256 is deprecated", "There is no difference"], correct: 0, explanation: "RS256 uses asymmetric cryptography allowing microservices to verify tokens using a public key." },
      { id: "sec40-q5", question: "Where is a JWT Bearer token typically passed in HTTP requests?", options: ["In the `Authorization` header (`Authorization: Bearer <token>`)", "In URL query string", "In CSS", "In HTML body"], correct: 0, explanation: "The `Authorization: Bearer <token>` header is standard." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 2, "JWT Authentication", "jwt-authentication", 2,
    "access-refresh-tokens", "Access Tokens & Refresh Token Architecture",
    "Implement short-lived Access Tokens (15m) paired with long-lived Refresh Tokens (7d) stored in HTTP-Only cookies.",
    "Security", "intermediate", 40, 160,
    ["Short-Lived Access Tokens (15m)", "Long-Lived Refresh Tokens (7d)", "Refresh Token Endpoint (`/api/auth/refresh`)", "Revocation Strategies"],
    "Dual Token Architecture",
    `// Access Token (Short: 15m) -> Sent in Authorization Header\n// Refresh Token (Long: 7d) -> Sent in Secure HTTP-Only Cookie`,
    [
      { id: "sec41-q1", question: "Why are short-lived Access Tokens (e.g. 15 minutes) recommended in JWT authentication?", options: ["To limit the window of vulnerability if an access token is compromised", "To save server disk space", "To speed up V8", "To format JSON"], correct: 0, explanation: "Short lifespan limits exposure if an access token is leaked." },
      { id: "sec41-q2", question: "Where should Refresh Tokens be stored on the client side?", options: ["In a secure, HTTP-Only, SameSite Cookie", "In browser localStorage", "In global window variable", "In URL params"], correct: 0, explanation: "HTTP-Only cookies protect refresh tokens from XSS script theft." },
      { id: "sec41-q3", question: "What is the purpose of the `/api/auth/refresh` endpoint?", options: ["To issue a new short-lived Access Token when presented with a valid Refresh Token", "To delete the user", "To reset password", "To list products"], correct: 0, explanation: "Refresh endpoints exchange valid refresh tokens for new access tokens." },
      { id: "sec41-q4", question: "Why is storing JWTs in `localStorage` considered a security risk?", options: ["Any XSS vulnerability on the page allows malicious scripts to steal the stored JWT", "localStorage is slow", "localStorage expires instantly", "localStorage requires HTTPS"], correct: 0, explanation: "Any script running on the domain can read `localStorage`." },
      { id: "sec41-q5", question: "How can a backend revoke a stateless JWT before its natural expiration?", options: ["Maintain a Redis token blacklist or increment a user token version counter in the database", "Stateless tokens cannot be tracked", "Delete Node.js", "Restart server"], correct: 0, explanation: "Redis token blacklists or user token versioning allow immediate token revocation." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 2, "JWT Authentication", "jwt-authentication", 3,
    "token-security-rotation", "Refresh Token Rotation & Reuse Detection",
    "Protect against token theft using Refresh Token Rotation, family tracking, and automatic session revocation on reuse.",
    "Security", "intermediate", 40, 160,
    ["Refresh Token Rotation (RTR)", "Token Family Tracking", "Reuse Detection & Automated Invalidation", "Compromised Token Recovery"],
    "Token Rotation & Reuse Detection",
    `// Refresh Token Rotation: Every refresh request invalidates the old refresh token and issues a new pair.\n// If an OLD refresh token is reused, revoke the ENTIRE token family!`,
    [
      { id: "sec42-q1", question: "What is Refresh Token Rotation (RTR)?", options: ["Issuing a NEW Refresh Token alongside every new Access Token, invalidating the previously used Refresh Token", "Changing passwords daily", "Rotating server ports", "Re-encrypting database"], correct: 0, explanation: "RTR ensures refresh tokens can only be used once." },
      { id: "sec42-q2", question: "What action should a backend take if an ALREADY-USED Refresh Token is presented to `/refresh`?", options: ["Detect token reuse, revoke the ENTIRE family of refresh tokens for that user, and force re-login", "Issue a new token", "Ignore the request", "Return 200 OK"], correct: 0, explanation: "Reusing a invalidated refresh token indicates theft, triggering full session revocation." },
      { id: "sec42-q3", question: "What is Token Family Tracking?", options: ["Grouping access/refresh token pairs under a shared Family ID to trace token lineage and revoke compromised streams", "Naming tokens after users", "Creating token folders", "Sorting tokens"], correct: 0, explanation: "Family tracking groups tokens belonging to a session grant." },
      { id: "sec42-q4", question: "What attack vector does Refresh Token Rotation directly mitigate?", options: ["Silent theft and long-term background persistence of stolen refresh tokens", "SQL Injection", "Buffer overflow", "DNS spoofing"], correct: 0, explanation: "RTR detects stolen refresh tokens as soon as either the attacker or legitimate user attempts to refresh." },
      { id: "sec42-q5", question: "Which HTTP status code should be returned when token reuse detection triggers?", options: ["401 Unauthorized or 403 Forbidden", "200 OK", "500 Internal Error", "302 Found"], correct: 0, explanation: "401/403 revokes client session access." }
    ]
  ),

  // Module 3: API Security Hardening
  makeLesson(
    "backend-auth-security", 3, "API Security Hardening", "api-security-hardening", 1,
    "input-sanitization-validation", "Input Sanitization & Injection Defense",
    "Sanitize incoming strings, strip HTML tags (XSS defense), and validate data types against strict injection attacks.",
    "Security", "intermediate", 40, 160,
    ["Cross-Site Scripting (XSS) Sanitization", "HTML Entity Encoding", "Sanitizing Object Injection Inputs", "Zod Strict Schema Parsing"],
    "Input Sanitization",
    `import sanitizeHtml from 'sanitize-html';\nconst cleanBio = sanitizeHtml(req.body.bio, { allowedTags: [] });`,
    [
      { id: "sec43-q1", question: "What is Stored XSS (Cross-Site Scripting)?", options: ["An attacker injects malicious `<script>` tags into stored database fields that execute when rendered in victim browsers", "Server CPU crash", "Deleting database", "Formatting text"], correct: 0, explanation: "Stored XSS executes malicious scripts saved in database records." },
      { id: "sec43-q2", question: "How do you sanitize user-supplied HTML text inputs before rendering?", options: ["Encode HTML special characters (`<` to `&lt;`) or strip untrusted tags using a sanitizer library", "Delete text", "Convert to uppercase", "Encrypt password"], correct: 0, explanation: "HTML entity encoding converts executable script tags into harmless plain text." },
      { id: "sec43-q3", question: "Why is validating types strictly (`z.string()`) important for preventing injection?", options: ["It rejects unexpected object payloads (`{ $ne: null }`) sent in place of plain strings", "It makes CSS faster", "It converts numbers", "It formats dates"], correct: 0, explanation: "Type validation blocks object injection payloads." },
      { id: "sec43-q4", question: "What Zod method strips unmapped extra properties from input objects?", options: [".strict() or default schema parsing", ".clean()", ".remove()", ".sanitize()"], correct: 0, explanation: "`schema.strict()` causes validation to fail if unexpected properties are present." },
      { id: "sec43-q5", question: "Which HTTP header instructs browsers NOT to guess Content-Type mime types?", options: ["X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "X-XSS-Protection: 1", "Content-Security-Policy"], correct: 0, explanation: "`nosniff` prevents mime-sniffing attacks." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 3, "API Security Hardening", "api-security-hardening", 2,
    "nosql-injection-headers", "NoSQL Injection Defense & Security Headers",
    "Harden Express against NoSQL query operator injection (`express-mongo-sanitize`) and configure Helmet HTTP headers.",
    "Security", "intermediate", 40, 160,
    ["NoSQL Injection Operator Payload (`{ $gt: '' }`)", "express-mongo-sanitize", "Helmet Security Header Suite", "Content Security Policy (CSP)"],
    "NoSQL Injection Defense",
    `import mongoSanitize from 'express-mongo-sanitize';\nimport helmet from 'helmet';\n\napp.use(mongoSanitize()); // Strips $ and . from req.body, req.query\napp.use(helmet());`,
    [
      { id: "sec44-q1", question: "How does a NoSQL Injection attack occur in MongoDB queries?", options: ["An attacker passes an object containing MongoDB operators (like `{ username: 'admin', password: { $ne: null } }`) to bypass password checks", "By typing SQL syntax", "By overloading RAM", "By closing sockets"], correct: 0, explanation: "Unsanitized input objects allow injecting operator expressions into Mongoose filters." },
      { id: "sec44-q2", question: "What does the `express-mongo-sanitize` middleware do?", options: ["Strips keys containing `$` dollar signs or `.` dots from `req.body`, `req.query`, and `req.params`", "Deletes databases", "Encrypts JSON", "Formats HTML"], correct: 0, explanation: "`express-mongo-sanitize` strips `$` and `.` to neutralize query operator injection." },
      { id: "sec44-q3", question: "What security header prevents an application from being embedded inside an iframe (Clickjacking defense)?", options: ["X-Frame-Options: DENY or SAMEORIGIN", "X-XSS-Protection", "Strict-Transport-Security", "Access-Control-Allow-Origin"], correct: 0, explanation: "`X-Frame-Options` blocks clickjacking frame embedding." },
      { id: "sec44-q4", question: "What does the `Strict-Transport-Security` (HSTS) header enforce?", options: ["Instructs browsers to load the domain exclusively using encrypted HTTPS for specified duration", "Strict password rules", "Strict TypeScript checks", "Strict JSON format"], correct: 0, explanation: "HSTS forces browsers to connect via HTTPS only." },
      { id: "sec44-q5", question: "What does Content Security Policy (CSP) control?", options: ["Restricts the sources of scripts, styles, images, and fonts the browser is allowed to load for a page", "Controls database table size", "Configures server RAM", "Formats log files"], correct: 0, explanation: "CSP restricts authorized script execution origins." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 3, "API Security Hardening", "api-security-hardening", 3,
    "rate-limiting-abuse-protection", "Rate Limiting, DDoS & Abuse Protection Architecture",
    "Implement IP rate limiters, auth route limiters, and sliding-window Redis rate limiters for abuse protection.",
    "Security", "intermediate", 40, 160,
    ["Global vs Route-Specific Rate Limiters", "Sliding Window Algorithm", "Redis Token Bucket Rate Limiting", "Account Lockout Strategies"],
    "Abuse Protection",
    `const loginLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 mins\n  max: 5, // 5 failed attempts per IP\n  message: { success: false, error: "Too many failed login attempts" }\n});`,
    [
      { id: "sec45-q1", question: "Why should authentication routes (`/api/auth/login`) have stricter rate limits than public GET routes?", options: ["To prevent automated credential stuffing and password brute-force attacks", "To save database space", "To speed up V8", "To format JSON"], correct: 0, explanation: "Strict auth limits mitigate brute-force password cracking." },
      { id: "sec45-q2", question: "What algorithm provides smooth, accurate rate limiting across rolling time windows?", options: ["Sliding Window Algorithm", "Fixed Window", "Random Drop", "First In First Out"], correct: 0, explanation: "Sliding window rate limiting prevents burst traffic spikes at window boundaries." },
      { id: "sec45-q3", question: "Why should rate limit counters be stored in Redis in production cluster environments?", options: ["Redis enables shared rate limit tracking across multiple stateless API server instances behind a load balancer", "Redis formats code", "Redis compiles TypeScript", "Redis encrypts passwords"], correct: 0, explanation: "Redis provides shared rate limit state for clustered servers." },
      { id: "sec45-q4", question: "What is Account Lockout?", options: ["Temporarily disabling a user account after N consecutive failed login attempts to stop brute-force attacks", "Deleting user account", "Resetting server", "Locking browser"], correct: 0, explanation: "Account lockout halts repeated automated password attempts." },
      { id: "sec45-q5", question: "Which header is returned with 429 status codes informing clients of rate limit quotas?", options: ["X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset", "Authorization", "Server", "Content-Length"], correct: 0, explanation: "Rate limit headers report quota status to clients." }
    ]
  ),

  // Module 4: Production Security Engineering
  makeLesson(
    "backend-auth-security", 4, "Production Security Engineering", "production-security", 1,
    "rbac-permission-matrix", "Role-Based Access Control (RBAC) & Permission Matrices",
    "Design Role-Based Access Control (RBAC) middleware matrices mapping roles ('student', 'instructor', 'admin') to permissions.",
    "Security", "advanced", 40, 160,
    ["RBAC Permission Matrix Design", "Role Guard Middleware `requireRole(['admin', 'instructor'])`", "Granular Permission Strings", "Hierarchical Roles"],
    "Role-Based Access Control",
    `export const requireRole = (...allowedRoles: string[]) => {\n  return (req: any, res: any, next: any) => {\n    if (!allowedRoles.includes(req.user.role)) {\n      return res.status(403).json({ success: false, error: "Forbidden: Insufficient privileges" });\n    }\n    next();\n  };\n};`,
    [
      { id: "sec46-q1", question: "What is Role-Based Access Control (RBAC)?", options: ["An authorization model that restricts system access to authorized users based on assigned roles ('admin', 'editor', 'user')", "Hashing passwords", "Encrypting database", "Setting cookies"], correct: 0, explanation: "RBAC assigns permissions to roles, and roles to users." },
      { id: "sec46-q2", question: "What HTTP status code should be returned when a logged-in 'student' attempts to access an '/api/admin/users' route?", options: ["403 Forbidden", "401 Unauthorized", "404 Not Found", "500 Server Error"], correct: 0, explanation: "Authenticated users attempting forbidden actions receive 403 Forbidden." },
      { id: "sec46-q3", question: "Where should `requireRole()` middleware be executed in the Express request pipeline?", options: ["AFTER the authentication middleware (which populates `req.user`) and BEFORE the target controller", "Before auth middleware", "Inside package.json", "After controller"], correct: 0, explanation: "RBAC middleware requires an authenticated `req.user` identity." },
      { id: "sec46-q4", question: "What is Attribute-Based Access Control (ABAC)?", options: ["An advanced authorization model that evaluates rules based on attributes of user, resource, environment, and action", "Using HTML attributes", "CSS styling", "Hashing strings"], correct: 0, explanation: "ABAC evaluates dynamic context attributes for fine-grained authorization." },
      { id: "sec46-q5", question: "Why is checking roles on the frontend UI alone insufficient for security?", options: ["Frontend code can be easily manipulated in browser dev tools; server-side role enforcement is mandatory", "Frontend JS is too fast", "Browsers don't support roles", "It causes memory leaks"], correct: 0, explanation: "Client-side checks are cosmetic; authorization MUST be enforced on the server." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 4, "Production Security Engineering", "production-security", 2,
    "ownership-resource-auth", "Ownership & Resource-Level Authorization Defense",
    "Prevent Insecure Direct Object Reference (IDOR) vulnerabilities by enforcing resource ownership scopes on database queries.",
    "Security", "advanced", 40, 160,
    ["Insecure Direct Object Reference (IDOR) Vulnerabilities", "Scoping DB Queries by Authenticated `userId`", "Object-Level Access Control", "IDOR Audit Checklist"],
    "Ownership Authorization",
    `// ❌ VULNERABLE TO IDOR:\n// const note = await Note.findById(req.params.id);\n\n// ✅ SECURE OWNERSHIP CHECK:\nconst note = await Note.findOne({ _id: req.params.id, userId: req.user.id });\nif (!note) return res.status(404).json({ success: false, error: "Note not found" });`,
    [
      { id: "sec47-q1", question: "What is an Insecure Direct Object Reference (IDOR) vulnerability?", options: ["An attack where a user modifies a URL ID (e.g. `/api/notes/99`) to view or delete another user's private data without authorization", "A broken CSS link", "A slow database query", "A duplicate key"], correct: 0, explanation: "IDOR occurs when an application exposes a reference to an internal implementation object without access control checks." },
      { id: "sec47-q2", question: "How do backend developers prevent IDOR vulnerabilities when updating/deleting user resources?", options: ["Explicitly including `{ userId: req.user.id }` in database filter queries to enforce ownership", "Using 302 redirects", "Hiding URLs", "Encrypting database disk"], correct: 0, explanation: "Scoping database operations by authenticated `userId` guarantees ownership authorization." },
      { id: "sec47-q3", question: "Why should `userId` NEVER be accepted from the request body as the authority for authorization?", options: ["Clients can tamper with request body parameters to impersonate other users; `req.user.id` from verified session/JWT must be used", "It makes JSON bigger", "Node.js rejects it", "It is illegal"], correct: 0, explanation: "Authenticated session data is authoritative; client payload parameters can be forged." },
      { id: "sec47-q4", question: "What HTTP status should be returned when a user attempts to update a resource ID belonging to someone else?", options: ["404 Not Found (or 403 Forbidden) to prevent revealing resource existence", "200 OK", "500 Server Error", "301 Redirect"], correct: 0, explanation: "Returning 404 Not Found conceals private resource existence from unauthorized users." },
      { id: "sec47-q5", question: "What automated test scenario verifies IDOR protection?", options: ["User A creates note N -> User B attempts `PUT /api/notes/N` -> Expect HTTP 404/403 and note N remains unchanged", "User A logs in", "User A changes password", "User A views homepage"], correct: 0, explanation: "Testing cross-user resource access attempts validates IDOR defenses." }
    ]
  ),
  makeLesson(
    "backend-auth-security", 4, "Production Security Engineering", "production-security", 3,
    "secure-production-checklist", "Secure Production Backend Checklist & Audit",
    "Execute an enterprise security audit: Secrets management, TLS/HTTPS, OWASP Top 10 mitigation, and deployment hardening.",
    "Security", "advanced", 40, 160,
    ["OWASP Top 10 API Security Checklist", "Secrets Management Vaults", "Dependency Vulnerability Auditing (`npm audit`)", "Production Environment Hardening"],
    "Security Checklist",
    `// Production Hardening Checklist:\n// 1. HTTPS / TLS 1.3 enforced\n// 2. Helmet security headers enabled\n// 3. NoSQL injection & XSS sanitization active\n// 4. Rate limiting on /api/ auth routes\n// 5. JWT secret min 256 bits, short expiry\n// 6. DB queries scoped by req.user.id\n// 7. npm audit zero high/critical vulnerabilities`,
    [
      { id: "sec48-q1", question: "What organisation publishes the definitive OWASP Top 10 API Security Risks guide?", options: ["Open Web Application Security Project (OWASP)", "W3C", "IEEE", "IETF"], correct: 0, explanation: "OWASP publishes the industry-standard API security risks reference." },
      { id: "sec48-q2", question: "Where should production API secret keys (JWT secret, DB URI) be managed?", options: ["In secure Environment Variables managed by key vaults (AWS Secrets Manager, HashiCorp Vault) and NEVER committed to Git", "Hardcoded in server.ts", "In public README.md", "In client HTML"], correct: 0, explanation: "Production secrets belong in secure environment vaults." },
      { id: "sec48-q3", question: "What command inspects installed Node modules for known vulnerability advisories?", options: ["npm audit", "npm inspect", "npm verify", "npm test"], correct: 0, explanation: "`npm audit` checks dependencies against the vulnerability registry." },
      { id: "sec48-q4", question: "Why is setting up automated dependency security scanning (Dependabot/Snyk) essential?", options: ["To automatically detect and patch vulnerable third-party dependencies as new security advisories are disclosed", "To format TypeScript", "To create indexes", "To lower RAM usage"], correct: 0, explanation: "Automated scanners catch newly discovered supply chain vulnerabilities." },
      { id: "sec48-q5", question: "What is the final rule of production backend security engineering?", options: ["Never trust client input; enforce defense-in-depth validation, authorization, and audit logging at every layer", "Trust all internal network calls", "Rely on client UI checks", "Disable error logs"], correct: 0, explanation: "Zero Trust and Defense-in-Depth are fundamental security paradigms." }
    ]
  ),
];

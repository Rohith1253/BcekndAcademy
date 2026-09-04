export interface VirtualFile {
  path: string;
  content: string;
  language: string;
}

export interface CodingLabTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName?: string;
  files: VirtualFile[];
  activeFile: string;
  defaultTests?: LabTestCase[];
  tags?: string[];
}

export interface LabTestCase {
  id: string;
  name: string;
  expectedStatus?: number;
  expectedBody?: any;
  customCode?: string;
}

export interface LabTestResult {
  id: string;
  name: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface HttpResponseCapture {
  method: string;
  path: string;
  status: number;
  data: any;
}

export interface ExecutionOutcome {
  success: boolean;
  output: string[];
  httpResponses: HttpResponseCapture[];
  errors: string[];
  executionTime: number;
}

export interface AIMessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  action?: string;
  provider?: string;
  timestamp: string;
  learningMode?: boolean;
}

export interface SavedWorkspaceSummary {
  _id: string;
  name: string;
  template: string;
  activeFile: string;
  fileCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedWorkspace {
  _id: string;
  name: string;
  template: string;
  activeFile: string;
  files: VirtualFile[];
  createdAt: string;
  updatedAt: string;
}

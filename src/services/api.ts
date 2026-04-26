const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.hirelith.com';

// AuthContext injects this so every request carries the Firebase ID token
type TokenGetter = () => Promise<string | null>;
let _getToken: TokenGetter = () => Promise.resolve(null);

export function setTokenProvider(fn: TokenGetter) {
  _getToken = fn;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await _getToken();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Multipart file upload. Pass a FormData object.
   * Content-Type is intentionally omitted so fetch sets it with the correct boundary.
   */
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await _getToken();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        // No Content-Type — fetch sets multipart/form-data + boundary automatically
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}

export const api = new ApiService();

// ── GitHub Trending ───────────────────────────────────────────────────────────

export interface GithubTrendingRepoDto {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  totalStars: number;
  totalForks: number;
  starsToday: number;
  contributors: string[];
  url: string;
  since: string;
  scrapedDate: string;
  scrapedAt: string;
}

export interface GithubTrendingMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GithubTrendingResponse {
  data: GithubTrendingRepoDto[];
  meta: GithubTrendingMeta;
}

export function fetchGithubTrending(
  since: 'daily' | 'weekly' | 'monthly' = 'daily',
  page = 1,
  limit = 20,
  language?: string,
  date?: string,
): Promise<GithubTrendingResponse> {
  const params = new URLSearchParams({ since, page: String(page), limit: String(limit) });
  if (language) params.set('language', language);
  if (date) params.set('date', date);
  return api.get<GithubTrendingResponse>(`/api/github-trending?${params.toString()}`);
}

export function fetchGithubTrendingDates(since: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<string[]> {
  return api.get<string[]>(`/api/github-trending/dates?since=${since}`);
}

export function fetchStarredRepos(firebaseUid: string): Promise<GithubTrendingRepoDto[]> {
  return api.get<GithubTrendingRepoDto[]>(`/api/github-trending/starred?firebaseUid=${encodeURIComponent(firebaseUid)}`);
}

export function fetchStarredList(firebaseUid: string): Promise<string[]> {
  return api.get<string[]>(`/api/github-trending/starred/list?firebaseUid=${encodeURIComponent(firebaseUid)}`);
}

export function starRepo(firebaseUid: string, repoFullName: string): Promise<void> {
  return api.post<void>('/api/github-trending/starred', { firebaseUid, repoFullName });
}

export function unstarRepo(firebaseUid: string, repoFullName: string): Promise<void> {
  return api.delete<void>(`/api/github-trending/starred?firebaseUid=${encodeURIComponent(firebaseUid)}&repoFullName=${encodeURIComponent(repoFullName)}`);
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export interface ApiJobSalary {
  min?: number;
  max?: number;
  currency?: string;
  period?: string;
  raw?: string;
}

// Matches the ScrapedJob interface from job-scraper module exactly
export interface ApiJob {
  id: string;
  source: string;
  sourceId: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  jobType?: string;
  category?: string;
  tags: string[];
  description: string;
  url: string;
  salary?: ApiJobSalary;
  postedAt?: string;
  expiresAt?: string;
}

export interface PaginatedJobsResponse {
  data: ApiJob[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LiveJobsMeta {
  total: number;
  sources: Record<string, { count: number; success: boolean; error?: string }>;
  durationMs: number;
}

// fetchJobs hits the DB-backed endpoint (empty until scrapers populate it)
export function fetchJobs(params?: {
  page?: number;
  limit?: number;
  remote?: boolean;
  location?: string;
  jobType?: string;
}): Promise<PaginatedJobsResponse> {
  const p = new URLSearchParams();
  if (params?.page) p.set('page', String(params.page));
  if (params?.limit) p.set('limit', String(params.limit));
  if (params?.remote !== undefined) p.set('remote', String(params.remote));
  if (params?.location) p.set('location', params.location);
  if (params?.jobType) p.set('jobType', params.jobType);
  return api.get<PaginatedJobsResponse>(`/api/v1/jobs?${p.toString()}`);
}

// fetchLiveJobs — scrapes all job sources in parallel, returns fresh jobs
// limit = per-source limit (e.g. limit=50 → up to 50 per scraper)
export interface LiveJobsResponse {
  jobs: ApiJob[];
  meta: LiveJobsMeta;
}

export function fetchLiveJobs(params?: {
  keyword?: string;
  location?: string;
  category?: string;
  limit?: number;
}): Promise<LiveJobsResponse> {
  const p = new URLSearchParams();
  if (params?.keyword) p.set('keyword', params.keyword);
  if (params?.location) p.set('location', params.location);
  if (params?.category) p.set('category', params.category);
  if (params?.limit) p.set('limit', String(params.limit));
  return api.get<LiveJobsResponse>(`/api/job-scraper/scrape?${p.toString()}`);
}

export function searchJobs(
  keyword: string,
  params?: { page?: number; limit?: number },
): Promise<PaginatedJobsResponse> {
  const p = new URLSearchParams({ keyword });
  if (params?.page) p.set('page', String(params.page));
  if (params?.limit) p.set('limit', String(params.limit));
  return api.get<PaginatedJobsResponse>(`/api/v1/jobs/search?${p.toString()}`);
}

// ── Cold Email ────────────────────────────────────────────────────────────────

export interface GenerateColdEmailPayload {
  companyName: string;
  companyDescription?: string;
  industry?: string;
  fundingStage?: string;
  location?: string;
  funding?: string;
  employeeCount?: string;
  foundedYear?: number;
  size?: string;
  tags?: string[];
  batch?: string;
  jobTitle?: string;
  userId?: string;
  senderName?: string;
  senderBackground?: string;
  tone?: 'formal' | 'friendly' | 'concise';
  resumeLink?: string;
  recipientEmail: string;
}

export interface GenerateColdEmailResult {
  subject: string;
  body: string;
  recipientEmail: string;
}

export function generateColdEmail(
  payload: GenerateColdEmailPayload,
): Promise<GenerateColdEmailResult> {
  return api.post<GenerateColdEmailResult>('/api/email/generate-cold-email', payload);
}

export interface SendAutoEmailPayload {
  to: string;
  subject: string;
  body: string;
  resumeUrl?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  acceptedRecipients: string[];
  rejectedRecipients: string[];
  timestamp: string;
  error?: string;
}

export function sendAutoEmail(payload: SendAutoEmailPayload): Promise<SendEmailResult> {
  return api.post<SendEmailResult>('/api/email/send-auto', payload);
}

// ── Companies ─────────────────────────────────────────────────────────────────

export interface ScrapedCompany {
  name: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  size: string;
  source: string;
  sourceUrl: string;
  externalId?: string;
  employeeCount?: string;
  foundedYear?: number;
  funding?: string;
  fundingStage?: string;
  logo?: string;
  tags?: string[];
  batch?: string;
}

export function fetchStartups(params?: {
  keyword?: string;
  industry?: string;
  limit?: number;
  page?: number;
}): Promise<ScrapedCompany[]> {
  const p = new URLSearchParams();
  if (params?.keyword) p.set('keyword', params.keyword);
  if (params?.industry) p.set('industry', params.industry);
  if (params?.limit) p.set('limit', String(params.limit));
  if (params?.page) p.set('page', String(params.page));
  return api.get<ScrapedCompany[]>(`/api/companies/startups?${p.toString()}`);
}

export function fetchMidSizeCompanies(params?: {
  keyword?: string;
  limit?: number;
  page?: number;
}): Promise<ScrapedCompany[]> {
  const p = new URLSearchParams();
  if (params?.keyword) p.set('keyword', params.keyword);
  if (params?.limit) p.set('limit', String(params.limit));
  if (params?.page) p.set('page', String(params.page));
  return api.get<ScrapedCompany[]>(`/api/companies/mid-size?${p.toString()}`);
}

export function fetchEnterpriseCompanies(params?: {
  keyword?: string;
  limit?: number;
  page?: number;
}): Promise<ScrapedCompany[]> {
  const p = new URLSearchParams();
  if (params?.keyword) p.set('keyword', params.keyword);
  if (params?.limit) p.set('limit', String(params.limit));
  if (params?.page) p.set('page', String(params.page));
  return api.get<ScrapedCompany[]>(`/api/companies/enterprise?${p.toString()}`);
}

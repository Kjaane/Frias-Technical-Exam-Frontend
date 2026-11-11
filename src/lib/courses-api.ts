import type { LoginResponse } from "@/src/types/auth";
import type { Course } from "@/src/types/course";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"
).replace(/\/$/, "");

function isCourse(value: unknown): value is Course {
  if (typeof value !== "object" || value === null) return false;
  const course = value as Record<string, unknown>;

  return (
    typeof course.id === "number" &&
    typeof course.title === "string" &&
    typeof course.category === "string" &&
    typeof course.instructor === "string" &&
    typeof course.duration === "string" &&
    typeof course.level === "string" &&
    typeof course.description === "string" &&
    typeof course.color === "string" &&
    typeof course.icon === "string" &&
    Array.isArray(course.lessons) &&
    course.lessons.every((lesson) => typeof lesson === "string")
  );
}

function isLoginResponse(value: unknown): value is LoginResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  if (
    typeof response.token !== "string" ||
    response.token.length === 0 ||
    response.tokenType !== "Bearer" ||
    typeof response.expiresIn !== "number" ||
    response.expiresIn <= 0 ||
    typeof response.user !== "object" ||
    response.user === null
  ) {
    return false;
  }

  const user = response.user as Record<string, unknown>;
  return (
    typeof user.id === "number" &&
    typeof user.username === "string" &&
    (user.role === "admin" || user.role === "user")
  );
}

async function getResponseError(response: Response, action: string) {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string" &&
      data.error.trim()
    ) {
      return data.error;
    }
  } catch {
    // Use the HTTP status when the server does not return a JSON error body.
  }

  if (response.status === 400) return "Missing credentials.";
  if (response.status === 401) return "The credentials are incorrect.";
  return `${action} failed (${response.status} ${response.statusText}).`;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error(await getResponseError(response, "Sign-in"));
  }

  const data: unknown = await response.json();
  if (!isLoginResponse(data)) {
    throw new Error("The login API returned an invalid response.");
  }
  return data;
}

export async function getCourses(signal?: AbortSignal): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/courses`, { signal });
  if (!response.ok) {
    throw new Error(
      `Loading courses failed (${response.status} ${response.statusText}).`,
    );
  }

  const data: unknown = await response.json();
  const courseData =
    typeof data === "object" && data !== null && "courses" in data
      ? data.courses
      : data;
  if (!Array.isArray(courseData) || !courseData.every(isCourse)) {
    throw new Error("The courses API returned an invalid response.");
  }
  return courseData;
}

export async function sendCourseRequest(
  path: string,
  method: "PUT" | "DELETE",
  token: string,
  body?: Course,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(await getResponseError(response, "Course request"));
  }
}

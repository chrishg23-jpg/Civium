export const API_BASE = "http://localhost:3000"; // Works later in Codespaces/Replit

// Helper for POST requests
async function post(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Helper for GET requests
async function get(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  return res.json();
}

// API functions
export async function createHousehold(address: string) {
  return post("/households", { address });
}

export async function registerPerson(name: string, householdId: string) {
  return post("/persons", { name, householdId });
}

export async function sendSignal(signal: any) {
  return post("/signals", signal);
}

export async function getNeighbourhood(id: string) {
  return get(`/neighbourhoods/${id}`);
}

export async function joinNeighbourhood(householdId: string, neighbourhoodId: string) {
  return post(`/neighbourhoods/${neighbourhoodId}/join`, {
    householdId
  });
}

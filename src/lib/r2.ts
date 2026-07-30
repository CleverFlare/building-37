/**
 * Upload one or multiple files to R2.
 * Automatically handles parallel uploads and returns an array of uploaded file metadata.
 */
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/files", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = (await res.json()) as {
    files: { key: string; name: string };
  };

  return data.files;
}

/**
 * Replace an existing file in R2.
 */
export async function replaceFile(key: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);

  const res = await fetch("/api/files", {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Replace failed");
  return (await res.json()) as { key: string };
}

/**
 * Delete one or multiple files from R2.
 */
export async function deleteFile(keys: string[]) {
  // Run multiple deletions in parallel (if multiple keys provided)
  const deletions = await Promise.all(
    keys.map(async (k) => {
      const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: k }),
      });

      if (!res.ok) throw new Error(`Delete failed for key: ${k}`);
      return res.json() as Promise<{ success: boolean }>;
    }),
  );

  // Return single or multiple results based on input
  return deletions;
}

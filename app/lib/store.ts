// lib/store.ts
export interface StoredDocument {
  id: string;
  filename: string;
  content: string;
  preview: string;
  size: number;
  type: string;
  uploadedAt: string;
  isReadable?: boolean; // Add this
}

declare global {
  var documentStore: StoredDocument[];
}

global.documentStore = global.documentStore || [];

export const documentStore = global.documentStore;

export function addDocument(doc: StoredDocument) {
  documentStore.push(doc);
  console.log(`📚 Store now has ${documentStore.length} documents`);
  return doc;
}

export function getDocuments() {
  return documentStore;
}

export function clearDocuments() {
  documentStore.length = 0;
}
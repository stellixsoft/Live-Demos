'use client'

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics'
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

/** Firebase is optional: without env vars the site runs and simply doesn't record anything. */
export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId)

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

if (firebaseEnabled && typeof window !== 'undefined') {
  app = initializeApp(config)
  if (config.measurementId) {
    isSupported()
      .then((ok) => {
        if (ok && app) analytics = getAnalytics(app)
      })
      .catch(() => {})
  }
}

export function track(event: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (process.env.NODE_ENV === 'development') console.debug('[track]', event, params)
  if (analytics) logEvent(analytics, event, params)
}

export type LeadKind = 'quiz_completed' | 'cta_click' | 'sheet_offer' | 'contact_form'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
}

/** Firestore rejects `undefined` (including nested). Drop those keys; leave FieldValue / other sentinels alone. */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)).filter((item) => item !== undefined) as T
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined) continue
      out[key] = stripUndefined(v)
    }
    return out as T
  }
  return value
}

/** Saves one record to the `leads` collection. Rules allow create only; nobody can read from the browser. */
export async function saveLead(kind: LeadKind, data: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') console.debug('[lead]', kind, data)
  if (!app) return
  try {
    const payload = stripUndefined({
      kind,
      ...data,
      page: window.location.href.slice(0, 500),
      userAgent: navigator.userAgent.slice(0, 300),
    })
    await addDoc(collection(getFirestore(app), 'leads'), {
      ...payload,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn('Could not save lead', err)
  }
}

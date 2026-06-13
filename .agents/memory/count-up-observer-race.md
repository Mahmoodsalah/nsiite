---
name: Count-up animation stuck at 0 on direct page load
description: Why IntersectionObserver-driven counters fail on direct navigation but work after client-side routing.
---

# Count-up counters stuck at 0 on direct visit

Symptom: an animated number (e.g. "Mentees Guided") stays at 0 when the page is opened
directly by URL, but animates correctly when reached via in-app navigation.

**Why:** the page returns a loading skeleton while `isLoading` is true, so the counter
element is not in the DOM on first render. A `useCountUp` hook that wires its
IntersectionObserver through a plain `useRef` with deps like `[target, duration]` runs its
effect once with `ref.current === null` (no observer attached). When data loads and the
real element mounts, the effect only re-runs if `target` changed — but if the stored value
equals the in-code fallback, `target` is unchanged, so the observer never attaches and the
count never animates. Client-side navigation works only because React Query already has the
data cached, so the element is present from the first render.

**How to apply:** attach the observer with a **callback ref** (`useState<Node|null>` set via
a `useCallback` ref) and depend the observer effect on the node. That way the observer
reattaches whenever the DOM node mounts, independent of whether `target` changed. Animate to
the latest target via a ref, cancel the `requestAnimationFrame` on cleanup, and snap to a new
target if it changes after the animation started.
